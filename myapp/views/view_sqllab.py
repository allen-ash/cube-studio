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
import uuid
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
from myapp.forms import MyBS3TextAreaFieldWidget,MySelect2Widget,MyCodeArea,MyLineSeparatedListField,MyJSONField,MyBS3TextFieldWidget,MySelectMultipleField
from wtforms.ext.sqlalchemy.fields import QuerySelectField
from flask import jsonify
from .baseApi import (
    MyappModelRestApi
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
import requests
from flask_appbuilder import CompactCRUDMixin, expose
import pysnooper,datetime,time,json
from myapp.security import MyUser
conf = app.config
logging = app.logger
aa = 1

class sqllabSession(BaseMyappView):

    route_base='/idex'

    @expose('/submit_task',methods=(["POST"]))
#    @pysnooper.snoop()
    def submit_task(self):
        # 根据配置产生一个 task，返回task id
        req_data = request.json
        task_url = 'http://xx',
        err_msg='',
        task_id = "task_id1"
        return {'task_url': task_url, "err_msg": err_msg, "task_id": task_id}


    @expose('/stop/<task_id>',methods=(["GET"]))
    @pysnooper.snoop()
    def stop(self, task_id):
        err_msg = ""
        return {'err_msg': err_msg}


    @expose('/look/<task_id>',methods=(["GET"]))
    @pysnooper.snoop()
    def check_task(self, task_id):
        global aa
        time.sleep(1)

        try:
            state='success'
            err_msg=''
            demo_data='''
name,age
user1,11
user2,12
user3,13
            '''
            result = self.convert_to_dataframe(demo_data)
            if result.empty:
                raise RuntimeError("执行成功，返回数据为空")
            cols = list(result.columns)
            import numpy as np
            result = np.array(result).tolist()
            result = [cols] + result

            task_url='http://xx'
            result_url='http://xx'
            spark_log_url='http://xx'
            spark_ui_url='http://xx'
        except:
            state = 'failure'
            err_msg = traceback.format_exc()
            result = ""
            result_url = ""
            spark_log_url = ""
            spark_ui_url = ""
        if aa==1:
            state='running'
            aa+=1
        return {'state':state, 'err_msg':err_msg, 'result':result, 'task_url': task_url, 'result_url':result_url, "spark_log_url":spark_log_url, "spark_ui_url":spark_ui_url}


    @expose('/log/<task_id>',methods=(["GET"]))
    @pysnooper.snoop()
    def log(self, task_id):
        log = ""
        return {'log': log}
    
    def convert_to_dataframe(self, res_text):
        import pandas as pd
        from io import StringIO
        data_steam=StringIO(res_text)
        try:
            df = pd.read_csv(data_steam, sep=',')
        except pd.errors.EmptyDataError:
            return pd.DataFrame()
        df = df.fillna("")
        return df


appbuilder.add_api(sqllabSession)



