from flask import render_template
from flask import Blueprint
from flask import url_for
from flask import jsonify
from flask import request
import sqlite3
from ..gameRec import init, tag_recommendation, text_based, game_similarity_recommendation

main = Blueprint('main', __name__, template_folder='templates',
                 static_folder='static', static_url_path="/static")


database = {}
game_data = []

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def index(path):
    return render_template('index.html')


@main.route("/getAllGame")
def get_data():
    database.clear()
    game_data.clear()
    results = init()
    data = []
    print("getAllGame")
    for row in results:
        item = {
            'id': row[0],
            'name': row[1],
            'class': row[2],
            'label': row[3],
            'language': row[4],
            'date': row[5],
            'positive_evaluation_rate': row[6],
            'comment_num': row[7],
            'wilson_score': row[8],
            'processor': "No Processor Limitation" if row[9] is None else row[9],
            'memory': row[10],
            'storage': "No Storage Limitation" if row[11] is None else row[11],
            'image': row[12],
            'description': row[13].replace('\u2122', '')
        }
        data.append(item)
        game_data.append(item)
        database[row[0]] = item
    return jsonify(data)


@main.route("/getGamesByTags", methods=['POST'])
def getDataByTag():
    req = request.get_json(silent=True, force=True)
    tag = req['selectedTags']
    print(tag)
    result = tag_recommendation(tag,database)
    return jsonify(result)


@main.route("/getGamesByDesc", methods=['POST'])
def getDataByDesc():
    print("getGamesByDesc")
    req = request.get_json(silent=True, force=True)
    des = req['description']
    result = text_based(des,database)
    return jsonify(result)

# @main.route("/getGamesByDesc", methods=['POST'])
# def getDataByDesc():
#     print("getGamesByDesc")
#     req = request.get_json(silent=True, force=True)
#     des = req['description']
#     result = desc_based(des,game_data)
#     return jsonify(result)


@main.route("/getGamesByName", methods=['POST'])
def getDataByName():
    print("getGamesByName")
    req = request.get_json(silent=True, force=True)
    id = req['id']
    print(id)
    # res = database.get(id)
    # rel_tag = eval(res[0][3])
    # print(rel_tag)
    result = game_similarity_recommendation(id,database)
    return jsonify(result)
