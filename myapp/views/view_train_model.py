from flask import render_template,redirect
from flask_appbuilder.models.sqla.interface import SQLAInterface
from flask import Blueprint, current_app, jsonify, make_response, request
# 将model添加成视图，并控制在前端的显示
from myapp.models.model_serving import Service
from myapp.models.model_train_model import Training_Model
from myapp.models.model_serving import InferenceService
from myapp.models.model_team import Project,Project_User
from myapp.utils import core
from flask_babel import gettext as __
from flask_babel import lazy_gettext as _
from flask_appbuilder.actions import action
from myapp import app, appbuilder,db,event_logger
import logging
import re
import uuid

import requests
from myapp.exceptions import MyappException
from flask_appbuilder.security.decorators import has_access
from myapp.models.model_job import Repository,Pipeline
from myapp.project import push_message,push_admin
from flask_wtf.file import FileAllowed, FileField, FileRequired
from werkzeug.datastructures import FileStorage
from wtforms.ext.sqlalchemy.fields import QuerySelectField
from myapp import security_manager
import os,sys
from wtforms.validators import DataRequired, Length, NumberRange, Optional,Regexp
from wtforms import BooleanField, IntegerField, SelectField, StringField,FloatField,DateField,DateTimeField,SelectMultipleField,FormField,FieldList
from flask_appbuilder.fieldwidgets import BS3TextFieldWidget,BS3PasswordFieldWidget,DatePickerWidget,DateTimePickerWidget,Select2ManyWidget,Select2Widget
from myapp.forms import MyBS3TextAreaFieldWidget,MySelect2Widget,MyCodeArea,MyLineSeparatedListField,MyJSONField,MyBS3TextFieldWidget,MySelectMultipleField
from myapp.utils.py import py_k8s
import os, zipfile
import shutil
from flask import (
    current_app,
    abort,
    flash,
    g,
    Markup,
    make_response,
    redirect,
    render_template,
    request,
    send_from_directory,
    Response,
    url_for,
)
from .base import (
    DeleteMixin,
    api,
    BaseMyappView,
    check_ownership,
    data_payload_response,
    DeleteMixin,
    generate_download_headers,
    get_error_msg,
    get_user_roles,
    handle_api_exception,
    json_error_response,
    json_success,
    MyappFilter,
    MyappModelView,
    json_response

)
from sqlalchemy import and_, or_, select
from .baseApi import (
    MyappModelRestApi
)

from flask_appbuilder import CompactCRUDMixin, expose
import pysnooper,datetime,time,json
conf = app.config


class Training_Model_Filter(MyappFilter):
    # @pysnooper.snoop()
    def apply(self, query, func):
        user_roles = [role.name.lower() for role in list(self.get_user_roles())]
        if "admin" in user_roles:
            return query
        return query.filter(self.model.created_by_fk == g.user.id)



# 定义数据库视图
# class Training_Model_ModelView(JsonResModelView,DeleteMixin):
class Training_Model_ModelView_Base():

    datamodel = SQLAInterface(Training_Model)
    base_permissions = ['can_add', 'can_edit', 'can_delete', 'can_list', 'can_show']  # 默认为这些
    base_order = ('changed_on', 'desc')
    order_columns = ['id']
    list_columns = ['name','project_url','pipeline_url','version','creator','modified','deploy']
    add_columns = ['project','pipeline','name','version','describe','path','framework','run_id','run_time','metrics','md5','api_type']
    edit_columns = add_columns

    cols_width={
        "name":{"type": "ellip2", "width": 250},
        "project_url": {"type": "ellip2", "width": 200},
        "pipeline_url":{"type": "ellip2", "width": 300},
        "version": {"type": "ellip2", "width": 200},
        "modified": {"type": "ellip2", "width": 150},
        "deploy": {"type": "ellip2", "width": 100},
    }
    spec_label_columns = {
        "path": "模型文件",
        "framework":"算法框架",
        "api_type":"推理框架"
    }

    label_title = '模型'
    base_filters = [["id", Training_Model_Filter, lambda: []]]  # 设置权限过滤器


    path_describe= r'''
            tfserving：仅支持tf save_model方式的模型目录, /mnt/xx/../saved_model/<br>
            torch-server：torch-model-archiver编译后的mar模型文件地址, /mnt/xx/../xx.mar<br>
            onnxruntime：onnx模型文件的地址, /mnt/xx/../xx.onnx<br>
            tensorrt:模型文件地址, /mnt/xx/../xx.plan<br>
            '''

    def filter_project():
        query = db.session.query(Project)
        user_roles = [role.name.lower() for role in list(get_user_roles())]
        if "admin" in user_roles:
            return query.filter(Project.type=='org').order_by(Project.id.desc())

        # 查询自己拥有的项目
        my_user_id = g.user.get_id() if g.user else 0
        owner_ids_query = db.session.query(Project_User.project_id).filter(Project_User.user_id == my_user_id)

        return query.filter(Project.id.in_(owner_ids_query)).filter(Project.type=='org').order_by(Project.id.desc())

    service_type_choices= [x.replace('_','-') for x in ['tfserving','torch-server','onnxruntime','triton-server']]

    add_form_extra_fields={

        "project": QuerySelectField(
            _('模型服务项目组'),
            description=_('如果没有可选项目组，可联系管理员加入到项目组中'),
            query_factory=filter_project,
            allow_blank=False,
            widget=Select2Widget(),
            validators=[DataRequired()]
        ),
        "path": FileField(
            _('模型文件地址'),
            default='/mnt/admin/xx/saved_model/',
            description=_(path_describe),
            validators=[DataRequired()]
        ),
        "describe": FileField(
            _(datamodel.obj.lab('describe')),
            description=_('模型描述'),
            validators=[DataRequired()]
        ),
        "version": StringField(
            _('版本'),
            widget=MyBS3TextFieldWidget(),
            description='模型版本',
            default=datetime.datetime.now().strftime('v%Y.%m.%d.1'),
            validators=[DataRequired()]
        ),
        "run_id":StringField(
            _(datamodel.obj.lab('run_id')),
            widget=MyBS3TextFieldWidget(),
            description='pipeline 训练的run id',
            default='random_run_id_'+uuid.uuid4().hex[:32]
        ),
        "run_time": StringField(
            _(datamodel.obj.lab('run_time')),
            widget=MyBS3TextFieldWidget(),
            description='pipeline 训练的 运行时间',
            default=datetime.datetime.now().strftime('%Y.%m.%d %H:%M:%S'),
        ),
        "name":StringField(
            _("模型名"),
            widget=MyBS3TextFieldWidget(),
            description='模型名(a-z0-9-字符组成，最长54个字符)',
            validators = [DataRequired(),Regexp("^[a-z0-9\-]*$"),Length(1,54)]
        ),
        "framework": SelectField(
            _('算法框架'),
            description="选项xgb、tf、pytorch、onnx、tensorrt等",
            widget=Select2Widget(),
            choices=[['xgb', 'xgb'],['tf', 'tf'], ['pytorch', 'pytorch'],['onnx','onnx'],['tensorrt','tensorrt']],
            validators=[DataRequired()]
        ),
        'api_type': SelectField(
            _("部署类型"),
            description="推理框架类型",
            choices=[[x, x] for x in service_type_choices],
            validators=[DataRequired()]
        )
    }
    edit_form_extra_fields=add_form_extra_fields
    # edit_form_extra_fields['path']=FileField(
    #         _('模型压缩文件'),
    #         description=_(path_describe),
    #         validators=[
    #             FileAllowed(["zip",'tar.gz'],_("zip/tar.gz Files Only!")),
    #         ]
    #     )


    @pysnooper.snoop(watch_explode=('item'))
    def pre_add(self,item):
        if not item.run_id:
            item.run_id='random_run_id_'+uuid.uuid4().hex[:32]

    def pre_update(self,item):
        if not item.path:
            item.path=self.src_item_json['path']
        self.pre_add(item)

    @expose("/deploy/<model_id>", methods=["GET",'POST'])
    def deploy(self,model_id):
        train_model = db.session.query(Training_Model).filter_by(id=model_id).first()
        exist_inference = db.session.query(InferenceService).filter_by(model_name=train_model.name).filter_by(model_version=train_model.version).first()
        if not exist_inference:
            exist_inference = InferenceService()
            exist_inference.project_id=train_model.project_id
            exist_inference.model_name=train_model.name
            exist_inference.label = train_model.describe
            exist_inference.model_version=train_model.version
            exist_inference.model_path=train_model.path
            exist_inference.service_type=train_model.api_type
            exist_inference.images=''
            exist_inference.name='%s-%s-%s'%(exist_inference.service_type,train_model.name,train_model.version.replace('v','').replace('.',''))
            db.session.add(exist_inference)
            db.session.commit()
            flash('新服务版本创建完成','success')
        else:
            flash('服务版本已存在', 'success')
        import urllib.parse
        from urllib.parse import urlencode, quote_plus
        url = conf.get('MODEL_URLS',{}).get('inferenceservice','')+'?filter=%5B%7B%22key%22%3A%22model_name%22%2C%22value%22%3A%22{model_name}%22%7D%5D'.format(model_name=exist_inference.model_name)
        print(url)
        return redirect(url)

    @expose("/api/deploy/<env>", methods=["GET", 'POST'])
    # @pysnooper.snoop()
    def api_deploy(self,env):
        try:
            model_project_name = request.json.get('model_project_name', '')
            pipeline_id = int(request.json.get('pipeline_id', '0'))
            run_id = request.json.get('run_id', '')
            model_path = request.json.get('model_path', '')
            model_name = request.json.get('model_name', '')
            model_project = db.session.query(Project).filter_by(name=model_project_name).filter_by(type='model').first()
            train_model=None
            if pipeline_id and run_id:
                # pipeline = db.session.query(Pipeline).filter_by(id=pipeline_id).first()
                train_model = db.session.query(Training_Model).filter_by(pipeline_id=pipeline_id).filter_by(run_id=run_id).first()
            elif model_path and model_name:
                train_model = db.session.query(Training_Model).filter_by(path=model_path).filter_by(name=model_name).first()

            if train_model and env in ['test','prod']:
                if env=='test':
                    self.deploy_test(train_model.id)
                    return json_response(message='deploy %s success' % env, status=0, result={})
                elif env=='prod' and model_project:
                    train_model.project=model_project
                    db.session.commit()
                    self.deploy_prod(train_model.id,force=True)
                    return json_response(message='deploy %s success'%env,status=0,result={})


            return json_response(message='no pipeline, run_id, model_project or env not in test,prod',status=1,result={})
        except Exception as e:
            return json_response(message=str(e),status=1,result={})



class Training_Model_ModelView(Training_Model_ModelView_Base,MyappModelView,DeleteMixin):
    datamodel = SQLAInterface(Training_Model)

# 添加视图和菜单
appbuilder.add_view(Training_Model_ModelView,"模型管理",icon = 'fa-hdd-o',category = '服务化',category_icon = 'fa-tasks')


# 添加api
class Training_Model_ModelView_Api(Training_Model_ModelView_Base,MyappModelRestApi):  # noqa
    datamodel = SQLAInterface(Training_Model)
    # base_order = ('id', 'desc')
    route_base = '/training_model_modelview/api'


appbuilder.add_api(Training_Model_ModelView_Api)


