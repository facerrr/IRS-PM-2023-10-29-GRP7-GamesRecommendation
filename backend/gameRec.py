import networkx as nx
import sqlite3
import os
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pandas as pd
import sqlite3
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
# import spacy
# from lightfm import LightFM
# from lightfm.data import Dataset

# nlp = spacy.load("en_core_web_sm")

current_dir = os.path.dirname(os.path.abspath(__file__))
dataPath = os.path.join(current_dir, 'game_data2.db')
filePath = os.path.join(current_dir, 'Game_graph2.0.gexf')

# import nltk
# nltk.download('stopwords')

# --------------------------------------------------------------------
# def desc_based(text,database):
#     descriptions = [game['description'] for game in database]
#     processed_descriptions = [nlp(description).vector for description in descriptions]

#     dataset = Dataset()
#     dataset.fit(users=[], items=range(len(database)))

#     item_ids = dataset.build_item_features(processed_descriptions)

#     model = LightFM(loss='warp')
#     model.fit(item_features=item_ids)

#     user_features = dataset.build_user_features([nlp(text).vector])

#     recommendations = model.predict(user_ids=[0], item_ids=range(len(database)), item_features=item_ids)

#     sorted_indices = recommendations.argsort()[::-1]

#     print(sorted_indices)

#     return 0



# --------------------------------------------------------------------
def text_based(text,database):
    text = text.lower()
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    tokens = [word for word in tokens if word not in stop_words]
    tokens = [word for word in tokens if word.isalpha()]


    conn = sqlite3.connect(dataPath)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM game_data3 ")
    results = cursor.fetchall()
    columns = [description[0] for description in cursor.description]
    game_data = pd.DataFrame(results, columns=columns)
    conn.close()

    game_data["class"] = game_data["class"].str.replace(r"[[\]',]", "")
    game_data["label"] = game_data["label"].str.replace(r"[[\]',]", "")
    game_data["class"] = game_data["class"].fillna(" ")
    game_corpus = game_data["class"] + ' ' + game_data["label"] + game_data["description"]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(game_corpus)
    user_vector = vectorizer.transform(tokens)
    similarity_scores = cosine_similarity(tfidf_matrix, user_vector)
    total_similarity_scores = np.sum(similarity_scores, axis=1)
    sorted_indices = total_similarity_scores.argsort()[::-1]
    recommendations = game_data.loc[sorted_indices, "id"].tolist()
    res = recommendations[:100]
    items = []
    print(len(recommendations))

    for id in res:
        item = database.get(id)
        items.append(item)

    return items


# --------------------------------------------------------------------
def wilson_sort(list):
    num_len=len(list)
    for i in range(num_len):
        for j in range(num_len-1-i):
            if list[j]['wilson_score']<list[j+1]['wilson_score']:
                temp=list[j]
                list[j]=list[j+1]
                list[j+1]=temp
    return list

def tag_recommendation(tag_list,database):
    G = nx.read_gexf(filePath)
    game_list=[]
    for x in tag_list:
        nei=nx.all_neighbors(G,x)
        temp=[]
        for y in nei:
            temp.append(y)
        game_list.append(temp)

    length = len(game_list) - 1
    result = []
    count = 0
    for element in game_list[length]:
        for i in range(length):
            if element in game_list[i]:
                count = count + 1
        if count == length:
            result.append(element)
        count = 0

    res=[]
    for y in result:
        res.append(database.get(int(y)))
    # res=reshape(res)
    # res=wilson_sort(res)
    return res


# --------------------------------------------------------------------
def jaccard_similarity(list1, list2):
    set1 = set(list1)
    set2 = set(list2)
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    similarity = intersection / union
    return similarity

def find_max(list,id):
    max=[0,0]
    for x in list:
        if x[0]!=id and x[1]>max[1]:
            max=x
        else:
            continue
    return max

def str_to_list(str):
    if not(str):
        str=None
    else:
        str=str.strip('[')
        str=str.strip(']')
        str=str.replace("'",'')
        str = str.replace("\t",'')
        str=str.split(', ',str.count(','))
    return str



def game_similarity_recommendation(id, database):
    jaccard_list=[]
    print(id)
    tag = database.get(id)['label']
    # print(tag)
    res = list(database.values())
    for z in res:
        if z['id'] != id:
            jaccard = jaccard_similarity(str_to_list(tag), str_to_list(z['label']))
            jaccard_list.append([z['id'],jaccard])
    i=0
    sorted_list= sorted(jaccard_list, key=lambda x: x[1], reverse=True)

    sub_list = [sublist[0] for sublist in sorted_list]
    res_list = sub_list[:50]
    result=[]
    for y in res_list:
        result.append(database.get(y))

    return result



if __name__=='__main__':
    res=tag_recommendation(['FPS', 'Shooter', 'Multiplayer', 'Competitive', 'Action', 'Team-Based', 'eSports', 'Tactical', 'First-Person', 'PvP', 'Online Co-Op', 'Co-op', 'Strategy', 'Military', 'War', 'Difficult', 'Trading', 'Realistic', 'Fast-Paced', 'Moddable'])
    # for x in res:
    #     print(x)
