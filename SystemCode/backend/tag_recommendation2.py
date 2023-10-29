import networkx as nx
import sqlite3
import spacy

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

def sqlite(id):
    conn = sqlite3.connect('./game_data3.db')
    cursorA = conn.cursor()
    sql = "select * from game_data3 where id="+id
    cursorA.execute(sql)  # 执行命令
    res = cursorA.fetchall()
    cursorA.close()
    conn.close()
    return res

def reshape(list):
    res=[]
    for x in list:
        for y in x:
            info={}
            info['id']=y[0]
            info['name']=y[1]
            info['class']=y[2]
            info['label']=y[3]
            info['language']=y[4]
            info['date']=y[5]
            info['per']=y[6]
            info['comment_num']=y[7]
            info['wilson_score']=y[8]
            info['processor']=y[9]
            info['memory']=y[10]
            info['storage']=y[11]
            info['image']=y[12]
            info['description']=y[13]
        res.append(info)

    return res

def wilson_sort(list):
    num_len=len(list)
    for i in range(num_len):
        for j in range(num_len-1-i):
            if list[j]['wilson_score']<list[j+1]['wilson_score']:
                temp=list[j]
                list[j]=list[j+1]
                list[j+1]=temp
    return list

def tag_recommendation(tag_list):
    G = nx.read_gexf("Game_graph2.0.gexf")
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
        res.append(sqlite(y))

    res=reshape(res)
    res=wilson_sort(res)
    return res

def jaccard_similarity(list1, list2):
    set1 = set(list1)
    set2 = set(list2)
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    similarity = intersection / union
    return similarity

def get_label(id):
    conn = sqlite3.connect('./game_data3.db')
    cursorA = conn.cursor()
    sql = 'select label from game_data3 where id='+id
    cursorA.execute(sql)  #执行命令
    res = cursorA.fetchall()
    cursorA.close()
    conn.close()
    label=[]
    for x in res:
        x=str_to_list(x[0])
        if not(x):
            continue
        else:
            for y in x:
                if y not in label:
                    label.append(y)
    return label


def find_max(list,id):
    max=[0,0]
    for x in list:
        if x[0]!=id and x[1]>max[1]:
            max=x
        else:
            continue
    return max

def game_similarity_recommendation(id):
    conn = sqlite3.connect('./game_data3.db')
    cursorA = conn.cursor()
    sql = 'select id,label from game_data3'
    cursorA.execute(sql)  # 执行命令
    res = cursorA.fetchall()
    cursorA.close()
    conn.close()

    jaccard_list=[]
    list1=get_label(id)
    for z in res:
        jaccard = jaccard_similarity(list1, str_to_list(z[1]))
        jaccard_list.append([z[0],jaccard])
    i=0
    res_list=[]
    while(i<10):
        max_jac = find_max(jaccard_list, int(id))
        res_list.append(max_jac[0])
        jaccard_list.remove(max_jac)
        i=i+1

    result=[]
    for y in res_list:
        result.append(sqlite(str(y)))
    result=reshape(result)

    return result

if __name__=='__main__':
    # res1=tag_recommendation(['Action','RPG','Adventure', 'Casual'])
    # for x in res1:
    #     print(x)

    res2=game_similarity_recommendation('730')
    for x in res2:
        print(x)
