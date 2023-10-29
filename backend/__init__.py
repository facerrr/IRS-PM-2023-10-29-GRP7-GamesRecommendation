from flask import Flask,render_template,g,session
# from httpRe import bp
def creat_app():
    app = Flask(__name__,template_folder="templates",static_folder="static",static_url_path="/backend/static")
    #注册蓝图
    from . import main
    app.register_blueprint(main.main)
    # app.register_blueprint(bp)
    app.config['SECRET_KEY'] = '...自己生成的秘钥'
    app.debug = True
    # db.init_app(app)
    return app

