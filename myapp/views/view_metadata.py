import traceback

from flask import render_template,redirect
from flask_appbuilder.models.sqla.interface import SQLAInterface
from flask_appbuilder import ModelView, ModelRestApi
from flask_appbuilder import ModelView,AppBuilder,expose,BaseView,has_access
from importlib import reload
from flask_babel import gettext as __
from flask_babel import lazy_gettext as _
from flask_babel import lazy_gettext,gettext
from flask_appbuilder.forms import GeneralModelConverter
from flask import current_app, flash, jsonify, make_response, redirect, request, url_for
import uuid
from flask import Blueprint, current_app, jsonify, make_response, request
from flask_appbuilder.actions import action
import re,os
from wtforms.validators import DataRequired, Length, NumberRange, Optional,Regexp
from kfp import compiler
from sqlalchemy.exc import InvalidRequestError
# 将model添加成视图，并控制在前端的显示
from myapp import app, appbuilder,db,event_logger
from myapp.utils import core
from wtforms import BooleanField, IntegerField,StringField, SelectField,FloatField,DateField,DateTimeField,SelectMultipleField,FormField,FieldList
from flask_appbuilder.fieldwidgets import BS3TextFieldWidget,BS3PasswordFieldWidget,DatePickerWidget,DateTimePickerWidget,Select2ManyWidget,Select2Widget
from myapp.forms import MyBS3TextAreaFieldWidget,MySelect2Widget,MyCodeArea,MyLineSeparatedListField,MyJSONField,MyBS3TextFieldWidget,MySelectMultipleField,MySelect2ManyWidget
from wtforms.ext.sqlalchemy.fields import QuerySelectField

from .baseApi import (
    MyappModelRestApi,
    json_response
)
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
from myapp import security_manager
from werkzeug.datastructures import FileStorage
from .base import (
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
)
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from myapp.models.model_metadata import Metadata_table
from flask_appbuilder import CompactCRUDMixin, expose
import pysnooper,datetime,time,json
from myapp.security import MyUser
conf = app.config
logging = app.logger





Metadata_column_fields = {
    "name":StringField(
        label=_("列名"),
        description='列名(字母、数字、_ 组成)，最长50个字符',
        widget=BS3TextFieldWidget(),
        validators=[Regexp("^[a-z][a-z0-9_]*[a-z0-9]$"), Length(1, 54),DataRequired()]
    ),

    "describe": StringField(
        label=_('列描述'),
        description='列名描述',
        widget=BS3TextFieldWidget(),
        validators=[DataRequired()]
    ),
    "column_type": SelectField(
        label=_('字段类型'),
        description='列类型',
        widget=Select2Widget(),
        choices=[['int', 'int'], ['string', 'string'],['float', 'float']],
        validators=[DataRequired()]
    ),
    "remark": StringField(
        label=_('备注'),
        description='备注',
        widget=BS3TextFieldWidget(),
    ),
    "partition_type": SelectField(
        label=_('列分区类型'),
        description='字段分区类型',
        widget=Select2Widget(),
        choices=[['主分区', '主分区'], ['子分区', '子分区'],['非分区', '非分区']],
        validators=[DataRequired()]
    ),
}



class Metadata_table_ModelView_base():
    label_title='元数据 表'
    datamodel = SQLAInterface(Metadata_table)
    base_permissions = ['can_add','can_show','can_edit','can_list','can_delete']

    base_order = ("id", "desc")
    order_columns = ['id','storage_cost','visits_seven']


    add_columns = ['app','db','describe','field','warehouse_level','table','value_score','security_level','ttl','task_id','create_table_ddl']
    edit_columns = add_columns
    list_columns = ['db', 'table', 'owner','describe','field','warehouse_level', 'storage_cost','task_id']
    cols_width = {
        "db":{"type": "ellip2", "width": 250},
        "table":{"type": "ellip2", "width": 400},
        "owner":{"type": "ellip2", "width": 150},
        "field": {"type": "ellip2", "width": 150},
        "describe": {"type": "ellip2", "width": 300},
        "warehouse_level": {"type": "ellip2", "width": 150},
        "task_id": {"type": "ellip2", "width": 150},
        "storage_cost":{"type": "ellip2", "width": 200},
        "visits_seven":{"type": "ellip2", "width": 200},
        "visits_thirty":{"type": "ellip2", "width": 200}
    }


    add_form_extra_fields = {
        "table":StringField(
            label=_('表名'),
            default='${warehouse_level}_${app}_$describe_$cycle',
            description='数据表 格式：dwd_[产品]_[数据域]_[数据域描述]_[刷新周期d/w/m/y][存储策略i(增量)/和f(全量)]  例如，dwd_qm_common_click_di; 表名由字母数组下划线组成 ',
            widget=BS3TextFieldWidget(),
            validators=[Regexp("^[a-z][a-z0-9_]*[a-z0-9]$"), Length(1, 54),DataRequired()]
        ),
        "describe": StringField(
            label=_(datamodel.obj.lab('describe')),
            description='表格描述',
            widget=BS3TextFieldWidget(),
            validators=[DataRequired()]
        ),

        "app": SelectField(
            label=_(datamodel.obj.lab('app')),
            description='产品分类',
            widget=Select2Widget(),
            default='qqmusic',
            choices=[['qqmusic','腾讯QQ音乐'], ['qmkg','全民K歌'],['kugou', '酷狗'],['kuwo', '酷我'],['lrts', '懒人'], ['qmlite','小米lite'],['infra','基础架构'],['privacy', '封闭域'],['datagovernance','数据治理']],
            validators=[DataRequired()]
        ),
        "db": SelectField(
            label=_(datamodel.obj.lab('db')),
            description='数据库名称',
            widget=MySelect2Widget(can_input=True),
            choices=[[]],
            validators=[DataRequired()]
        ),
        "field":MySelectMultipleField(
            label=_(datamodel.obj.lab('field')),
            description='数据域',
            widget=Select2ManyWidget(),
            choices=[],
            validators=[]
        ),
        "security_level": SelectField(
            label=_(datamodel.obj.lab('security_level')),
            description='安全等级',
            widget=Select2Widget(),
            default='普通',
            choices=[[x,x] for x in ["普通", "机密","秘密","高度机密"]],
            validators=[DataRequired()]
        ),
        "value_score": StringField(
            label=_(datamodel.obj.lab('value_score')),
            description='价值评分',
            widget=BS3TextFieldWidget(),
        ),
        "storage_size": StringField(
            label=_(datamodel.obj.lab('storage_size')),
            description='存储大小',
            widget=BS3TextFieldWidget(),
        ),
        "warehouse_level": SelectField(
            label=_(datamodel.obj.lab('warehouse_level')),
            default='TMP',
            description='数仓等级，<a href="https://docs.qq.com/sheet/DRkJ1TXhSTGxYTmRT?tab=BB08J2">填写规范</a>',
            widget=Select2Widget(),
            choices=[["ODS",'ODS'],["DWD",'DWD'],["DWS",'DWS'],["TOPIC",'TOPIC'],['APP','APP'],["DIM",'DIM'],["TMP",'TMP']],
            validators=[DataRequired()]
        ),
        "crontab": StringField(
            label=_(datamodel.obj.lab('crontab')),
            default='1 1 * * *',
            description='周期任务的时间设定 * * * * * 一次性任务可不填写 <br>表示为 minute hour day month week',
            widget=BS3TextFieldWidget(),
        ),
        "storage_cost": StringField(
            label=_(datamodel.obj.lab('cost')),
            description='数据成本',
            widget=BS3TextFieldWidget(),
        ),
        "owner": StringField(
            label=_(datamodel.obj.lab('owner')),
            default='',
            description='责任人,逗号分隔的多个用户',
            widget=BS3TextFieldWidget(),
        ),
        "ttl": SelectField(
            label=_(datamodel.obj.lab('ttl')),
            description='保留周期',
            widget=Select2Widget(),
            default='一年',
            choices=[[x,x] for x in ["一周", "一个月","三个月","半年","一年","永久"]],
            validators=[DataRequired()]
        ),
        "sql_demo": StringField(
            _(datamodel.obj.lab('sql_demo')),
            description='建表sql 示例',
            widget=MyCodeArea(code=core.hive_create_sql_demo()),  # 传给widget函数的是外层的field对象，以及widget函数的参数
        ),
        "create_table_ddl": StringField(
            label='建表sql',
#             default='''
# -- 建表示例sql
# use {db_name};
# CREATE TABLE if not exists {table_name}(
# imp_date int COMMENT '统计日期',
# ori_log string COMMENT '原始日志',
# fint int COMMENT '某个数字字段'
# )
# PARTITION BY LIST(imp_date)
# (PARTITION default)
# STORED AS ORCFILE COMPRESS;
# '''
            description='建表sql语句，<font color="#FF0000">填写此处，就不需要再添加后续列信息。</font> <a href="https://doc.weixin.qq.com/doc/w3_AIkAjAZ3AColSOTQBZsSZSNWmGyA5?scode=AJEAIQdfAAotJcrnWHAIkAjAZ3ACo">sql语法</a>',
            widget=MyBS3TextAreaFieldWidget(rows=10)
        ),
        "insert_sql": StringField(
            label='数据导入sql',
            description='导入数据的insert sql。同时支持sql和pysql。',
            widget=MyBS3TextAreaFieldWidget(rows=10)
        ),
        "task_id": StringField(
            label=_(datamodel.obj.lab('task_id')),
            description='父任务id，有多个时用逗号分割',
            widget=BS3TextFieldWidget()
        )
    }

    edit_form_extra_fields = add_form_extra_fields

    add_fieldsets = [
        (
            lazy_gettext('表元数据'),
            {"fields": ['app','db','describe','field','warehouse_level','table','security_level','ttl','create_table_ddl'], "expanded": True},
        ),
        (
            lazy_gettext('数据生产配置'),
            {"fields": ['insert_sql','crontab','task_id'], "expanded": True},
        ),
    ]
    edit_fieldsets = add_fieldsets


    @action(
        "muldelete", __("Delete"), __("Delete all Really?"), "fa-trash", single=False
    )
    def muldelete(self, items):
        if not items:
            abort(404)
        for item in items:
            try:
                if g.user.is_admin() or (item.owner and g.user.username in item.owner):
                    self.datamodel.delete(item, raise_exception=True)
            except Exception as e:
                flash(str(e), "danger")


    # @pysnooper.snoop(watch_explode=('item'))
    def pre_add(self, item):
        # 建表
        item.owner = g.user.username
        item.node_id=item.db+"::"+item.table
        item.creator = g.user.username

    def make_up_ddl_sql(self, item):
        if item.create_table_ddl:
            return
        # 根据列信息重新生成create_table_ddl字段
        main_pri_num = 0 
        sub_pri_num = 0 
        main_pri_name = None
        sub_pri_name = None
        columns = json.loads(item.metadata_column) if item.metadata_column else []
        if not columns:
            return
        for col in columns:
            if col['partition_type'] == '主分区':
                main_pri_num+=1
                main_pri_name=col['name']

            elif col['partition_type'] == '子分区':
                sub_pri_num+=1
                sub_pri_name=col['name']
        if main_pri_num > 1:  
            raise RuntimeError('只能有一个主分区')
        if sub_pri_num > 1:  
            raise RuntimeError('只能有一个子分区')
        if sub_pri_num > main_pri_num:
            raise RuntimeError('有了主分区才能有子分区')
        cols_t = "{col_name} {col_type} COMMENT '{describe}'"
        cols=',\n'.join([cols_t.format(col_name=col['name'], col_type=col['column_type'], describe=col['describe'] if col['describe'] else '>无备注') for col in columns])

        default_pri=''
        main_pri=''
        if main_pri_num == 1:
            main_pri="PARTITION BY LIST({main_pri_name})".format(main_pri_name=main_pri_name)
            default_pri='(PARTITION default)'
        sub_pri=''
        if sub_pri_num == 1:
            sub_pri="SUBPARTITION BY LIST({sub_pri_name})".format(sub_pri_name=sub_pri_name)
            default_pri='(SUBPARTITION default)\n' + default_pri

        create_sql_t='''
use {db_name};
CREATE TABLE if not exists {table_name}(
{cols}
)
{main_pri}
{sub_pri}
{default_pri}
STORED AS ORCFILE COMPRESS;
'''
        create_table_ddl = create_sql_t.format(db_name=item.db, table_name=item.table, cols=cols, main_pri=main_pri, sub_pri=sub_pri, default_pri=default_pri)
        logging.info("create_table_ddl: " + str(create_table_ddl))
        item.create_table_ddl = create_table_ddl
        db.session.commit() 

    def post_add(self, item):
        self.make_up_ddl_sql(item)



class Metadata_table_ModelView_Api(Metadata_table_ModelView_base,MyappModelRestApi,DeleteMixin):
    datamodel = SQLAInterface(Metadata_table)
    route_base = '/metadata_table_modelview/api'
    add_columns = ['app', 'db', 'table', 'describe', 'field', 'warehouse_level','value_score', 'storage_cost', 'security_level', 'ttl','insert_sql','crontab','task_id','metadata_column','create_table_ddl']
    show_columns = ['app','db','table','describe','field','warehouse_level','owner','c_org_fullname','storage_size','lifecycle','rec_lifecycle','storage_cost','visits_seven','recent_visit','partition_start','partition_end','status','visits_thirty','create_table_ddl','insert_sql','crontab','task_id','metadata_column']
    edit_columns = add_columns
    search_columns=['app','db','table','describe','field','warehouse_level','task_id','owner']
    spec_label_columns = {
        "table":"表名"
    }



    # @pysnooper.snoop()
    def pre_add_get(self):
        self.default_filter = {
            "owner": g.user.username
        }

    # @pysnooper.snoop()
    def pre_get_list(self,result):
        data = result['data']
        for item in data:
            storage_cost = item.get('storage_cost',0)
            if storage_cost:
                item['storage_cost']=round(float(storage_cost), 6)
    # 把metadata_columns字段转化为[]

    def pre_get(self,_response):
        data = _response['data']
        data['metadata_column']=json.loads(data.get('metadata_column','[]'))

    # # 添加或者编辑时，提取附加子view参数
    # @pysnooper.snoop(watch_explode=('req_json',))
    def pre_json_load(self, req_json=None):
        if req_json and 'metadata_column' in req_json:
            req_json['metadata_column'] = json.dumps(req_json.get('metadata_column',[]),indent=4,ensure_ascii=False)
        return req_json



    # # 在info信息中添加特定参数
    # @pysnooper.snoop()
    def add_more_info(self,response,**kwargs):

        # 添加列信息到这里，因为列要按照数组的形式让用户填写
        from myapp.views.baseApi import API_RELATED_RIS_KEY,API_ADD_COLUMNS_RES_KEY,API_EDIT_COLUMNS_RES_KEY
        # if API_RELATED_RIS_KEY in response:
        #     if response[API_RELATED_RIS_KEY]:
        #         for column_name in response[API_RELATED_RIS_KEY]:
        #             response[API_ADD_COLUMNS_RES_KEY].append({
        #                 "name": column_name,
        #                 "ui-type": "list",
        #                 "info": response[API_RELATED_RIS_KEY][column_name]
        #             })
        #             response[API_EDIT_COLUMNS_RES_KEY].append({
        #                 "name": column_name,
        #                 "ui-type": "list",
        #                 "info": response[API_RELATED_RIS_KEY][column_name]
        #             })
        for col in response[API_ADD_COLUMNS_RES_KEY]:
            if col['name']=='metadata_column':
                response[API_EDIT_COLUMNS_RES_KEY].remove(col)
        for col in response[API_EDIT_COLUMNS_RES_KEY]:
            if col['name'] == 'metadata_column':
                response[API_EDIT_COLUMNS_RES_KEY].remove(col)

        response[API_ADD_COLUMNS_RES_KEY].append({
            "name": "metadata_column",
            "ui-type": "list",
            "info": self.columnsfield2info(Metadata_column_fields)
        })
        response[API_EDIT_COLUMNS_RES_KEY].append({
            "name": 'metadata_column',
            "ui-type": "list",
            "info": self.columnsfield2info(Metadata_column_fields)
        })


        # 添加字段间可取值关系，
        response['column_related']={}

        # app warehouse_level 与 数据域之间的关系
        response['column_related']['app_warehouse_level_field'] = {
            "src_columns": ["app", 'warehouse_level'],
            "des_columns": ['field'],
            "related": []
        }

    add_fieldsets = [
        (
            lazy_gettext('表元数据'),
            {"fields": ['app','db','describe','warehouse_level','field','table','security_level','ttl','create_table_ddl'], "expanded": True},
        ),
        (
            lazy_gettext('列信息'),
            {"fields": ['metadata_column'],
             "expanded": True},
        ),
        (
            lazy_gettext('数据生产配置'),
            {"fields": ['insert_sql','crontab','task_id'], "expanded": True},
        ),
    ]
    edit_fieldsets = add_fieldsets
    show_fieldsets=[
        (
            lazy_gettext('表元数据'),
            {"fields": ['app','db','table','describe','warehouse_level','field','owner','c_org_fullname'], "expanded": True},
        ),
        (
            lazy_gettext('表属性'),
            {"fields": ['storage_size', 'lifecycle', 'rec_lifecycle', 'storage_cost', 'visits_seven', 'recent_visit','partition_start','partition_end','status','visits_thirty'], "expanded": True},
        ),
        (
            lazy_gettext('数据生产配置'),
            {"fields": ['insert_sql','crontab','task_id'], "expanded": True},
        ),
    ]

    remember_columns=['app','db']
    label_title='hive库表'

appbuilder.add_api(Metadata_table_ModelView_Api)

