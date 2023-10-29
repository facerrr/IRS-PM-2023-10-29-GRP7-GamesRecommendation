import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import tag from './tag'

import { Layout, Button, Input, Card, Tree, Col, Row, Select, Space, Form, Pagination, Image, Rate, Tag, Flex } from 'antd';
import { Carousel, Divider, Switch, Drawer, Alert, Spin } from 'antd'
import { List } from 'antd';
import { AudioOutlined, SyncOutlined, StarOutlined, HeartOutlined, HeartFilled, UserOutlined } from '@ant-design/icons';
import axios from 'axios'
// const { Database } = require('sqlite3');
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';

const viewportWidth = window.innerWidth;
const pixelSiderOut = 0.18 * viewportWidth;
const pixelSiderIn = 0.18 * viewportWidth;

const { Header, Footer, Sider, Content } = Layout
const { Search } = Input;
const { TextArea } = Input;

const starIcon = <StarOutlined style={{ fontSize: '24px' }} />;
var showlist = [];

const siderInStyle = {
  background: 'white',
  padding: '10px',
  paddingRight: '10px',
  height: '100vh',
}

const sdierInHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px',
  paddingRight: '20px',
  backgroundColor: 'white',
  height: '5vh',
}

const sdierInContentStyle = {
  background: 'white',
  padding: '10px',
  paddingRight: '10px',
  height: '94vh',
}

const mainHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px',
  paddingRight: '10px',
  backgroundColor: 'white',
  height: '5vh',
}

const mainContentStyle = {
  background: 'white',
  padding: '10px',
  paddingRight: '10px',
  overflowY: 'auto',
  height: '90vh',
}

const mainFooterStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: 'white',
  height: '5vh',
}

const siderOutStyle = {
  background: 'white',
  padding: '10px',
  paddingRight: '10px',
  height: '100vh',
}

const siderOutHeaderStyle = {
  padding: '10px',
  paddingRight: '10px',
  backgroundColor: 'white',
  height: '5vh',
}

const siderOutContentStyle = {
  height: '94vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // justifyContent: 'center',
  backgroundColor: 'white',
  fontSize: '20px',
  fontFamily: 'Arial'
}

const clearButtonStyle = {
  width: '100%',
  // backgroundColor: '#4F4F4F'
}

const boder = {
  borderColor: 'black',
}

const nameBoxStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  padding: '8px',
}

const classes = ['Action', 'RPG', 'Strategy', 'Casual', 'Simulation', 'Indie', 'Horror', 'Raing', 'Sport', 'Multiplayer']
const allTags = [...tag[0], ...tag[1], ...tag[2], ...tag[3], ...tag[4], ...tag[5], ...tag[6], ...tag[7], ...tag[8], ...tag[9]];
const treeData = [];
const tagOption = [];
for (let i = 0; i < allTags.length; i++) {
  tagOption.push({
    label: allTags[i],
    value: allTags[i],
  });
}

for (let i = 0; i < classes.length; i++) {
  const tempNode = [];

  for (let j = 0; j < tag[i].length; j++) {
    tempNode.push(
      {
        title: tag[i][j],
        key: tag[i][j],
        checkable: true,
      },
    )
  };
  treeData.push(
    {
      title: classes[i],
      key: '0-' + String(i),
      checkable: false,
      children: tempNode
    },
  );
};
// const treeData = [
//   {
//     title: 'class',
//     key: '0-0',
//     checkable: false,
//     children: class_node
//   },
//   {
//     title: 'tag',
//     key: '0-1',
//     checkable: false,
//     children: tag_node
//   },
// ];


function App() {

  const [allGamesData, setAllGamesData] = useState(null);    //数据库内的所有游戏
  const [recGameList, setRecGameLsit] = useState([]);  // 当前推荐的游戏
  // const [showlist, setShowlist] = useState(null);
  const [gameNames, setGameNames] = useState([]);  // 用于游戏名字搜索，搜索对象：数据库内所有游戏
  const [currentPage, setCurrentPage] = useState(1);  // 当前页码
  const [currentPageSize, setCurrentPageSize] = useState(40);  //当前每页所包含游戏个数
  const [imageCols, setImageCols] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);   //选中的标签
  const [searchTagValue, setSearchTagValue] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const contentRef = useRef();
  // name, src, label, positive_evaluation_rate, processor, memory, storage, description
  const [selectedGame, setSelectedGame] = useState();
  const [hardWareReq, setHardWareReq] = useState([]);
  // var showlist = []
  const [liked, setLiked] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const filteredOptions = gameNames.filter((o) => !searchValue.includes(o));  //名字搜索过滤器

  const [switchStatus, setSwitchStatus] = useState(true);  //切换推荐模式 self-description or tag
  const [userInterface, setUserInterface] = useState(false);  //用户列表展开

  const [collapsedState, setCollapsedState] = useState(true);

  const [rankMode, setRankMode] = useState("Normal");

  const [isLoading, setIsLoading] = useState(true);

  const [description, setDescription] = useState('');

  const getAllGamesData = () => {
    const getData = async () => {
      setIsLoading(true);
      axios.get('/getAllGame')
        .then(response => {
          const data = response.data;
          setAllGamesData(data);
          setRecGameLsit(data);
          console.log(data[1]);
          const nameList = [];
          for (let i = 0; i < data.length; i++) {
            let _name = data[i].name;
            nameList.push(_name);
          }
          setGameNames(nameList);
          loadImage(currentPage, currentPageSize, data);
          setIsLoading(false);
          setRankMode("Normal");
          setIsLoading(false);
          // setShowlist(data);
          showlist = data;
        })
        .catch(error => {
          console.error(error);
        });

    }
    getData();

  };


  const getGamesByDesc = (desc) => {
    const getData = async () => {
      setIsLoading(true);
      axios.post('/getGamesByDesc', desc)
        .then(response => {
          let data = response.data;
          const _list = data;
          setRecGameLsit(_list);
          setCurrentPage(1);
          setRankMode("Normal");
          showlist = data;
          loadImage(1, currentPageSize, data);
          console.log(data[1]);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
        });
    }
    getData();
  }

  const getGamesByTags = (tags) => {
    const getData = async () => {
      console.log(tags);
      setIsLoading(true)
      axios.post('/getGamesByTags', tags)
        .then(response => {
          let data = response.data;
          const _list = data;
          console.log(data[0]);
          setRecGameLsit(_list);
          setCurrentPage(1);
          setRankMode("Normal");
          showlist = data;
          loadImage(1, currentPageSize, data);
          setIsLoading(false)
        })
        .catch(error => {
          console.error(error);
        });
    }
    getData();
  }

  const getGamesByName = (id) => {
    const getData = async () => {
      setIsLoading(true);
      axios.post('/getGamesByName', id)
        .then(response => {
          let data = response.data;
          const _list = data;
          console.log(data[1]);
          setRecGameLsit(_list);
          setCurrentPage(1);
          setRankMode("Normal");
          showlist = data;
          loadImage(1, currentPageSize, data);
          setIsLoading(false);
          // let data = response.data
          // const _list = data
        })
        .catch(error => {
          console.error(error);
        });
    }
    getData();
  }


  //load image
  const loadImage = (current, pageSize, data) => {
    const imageTemp = [];
    const nameTemp = [];
    for (let i = 0; i < data.length; i++) {
      let _imageSrc = data[i].image;
      let _name = data[i].name;
      imageTemp.push(_imageSrc);
      nameTemp.push(_name);
    }
    const _imgColsTemp = [];
    for (let i = 0; i < pageSize; i++) {
      if (i < data.length) {
        _imgColsTemp.push(
          <Col onClick={() => handleCardClick((current - 1) * pageSize + i)} xs={24} sm={24} md={12} lg={8} xl={6} xxl={6} offset={0.5} >
            {/* <div>
              <Card 
                hoverable 
                style={{ background: 'white', borderColor: 'black' }}
                cover={<img alt="example" src={imageTemp[(current - 1) * pageSize + i]} />}
              >{nameTemp[(current - 1) * pageSize + i]} 
              </Card>
            </div> */}
            <div className='image-container'>
              <img className='image' src={imageTemp[(current - 1) * pageSize + i]} style={{ width: '100%' }} />
              <div class='overlay' >
                <div class='text'>
                  {nameTemp[(current - 1) * pageSize + i]}
                </div>
              </div>
            </div>
          </Col>,
        );

      }
    }
    console.log("load image");
    setImageCols(_imgColsTemp);
  }

  const reset = () => {

  };

  const sortGame = (mode, list) => {
    const _arr = Object.entries(list);
    const sortedArray = _arr.sort((a, b) => {
      const rateA = (mode == 0 ? a[1].positive_evaluation_rate : a[1].wilson_score);
      const rateB = (mode == 0 ? b[1].positive_evaluation_rate : b[1].wilson_score);
      return rateB - rateA;
    });
    const sortedData = sortedArray.map(([_, obj]) => obj);
    return sortedData
  };

  //page变化的回调
  const onShowPageChange = (current, size) => {
    setCurrentPage(current);
    setCurrentPageSize(size);
    loadImage(current, size, showlist);
  };

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  const handleTreeCheck = (checked) => {
    setSelectedKeys(checked);
    const selectedTags = [];
    const traverseTree = (nodes) => {
      for (const node of nodes) {
        if (checked.includes(node.key)) {
          selectedTags.push(node.key);
        }
        if (node.children) {
          traverseTree(node.children);
        }
      }
    };
    traverseTree(treeData);
    setSearchTagValue(selectedTags);
    console.log(checked);
  };

  const handleClearSelection = () => {
    setSelectedKeys([]);
    setSearchTagValue([]);
    getAllGamesData();
    setDescription('');
  };

  const handleSelectChange = (value) => {
    setRankMode(value);
    setCurrentPage(1);
    if (value == 'Normal') {
      showlist = recGameList;
      loadImage(1, currentPageSize, showlist);
    } else if (value == 'Most Popular') {
      const listTemp = sortGame(1, recGameList);
      showlist = listTemp;
      loadImage(1, currentPageSize, listTemp);
    } else {
      const listTemp = sortGame(0, recGameList);
      showlist = listTemp;
      loadImage(1, currentPageSize, listTemp);
    }
    // setShowlist(value == 0 ? allGamesData : sorGamesData);
  };

  const handleCardClick = (key) => {
    if (collapsedState) {
      setCollapsedState(false);
    }
    setSelectedGame(showlist[key]);
    setHardWareReq([
      'Minimum Request\n ' + showlist[key].processor,
      'Minimum Request\n ' + showlist[key].memory,
      'Minimum Request\n ' + showlist[key].storage,
    ]);

  }

  const handleClick = () => {
    setLiked(!liked);
  };

  const handleDescChange = (e) => {
    setDescription(e.target.value);
  }

  const handleSearch = (value) => {
    if (collapsedState) {
      setCollapsedState(false);
    }
    setSearchValue(value);
    const _g = allGamesData.find((item) => item.name === value);
    const obj = { id: _g.id };
    getGamesByName(obj);
    setSelectedGame(_g);
    setHardWareReq([
      'Minimum Request\n ' + _g.processor,
      'Minimum Request\n ' + _g.memory,
      'Minimum Request\n ' + _g.storage,
    ]);
  };

  const handleTagSearch = (values) => {
    setSearchTagValue(values);
    const selectedKeys = [];
    const traverseTree = (nodes) => {
      for (const node of nodes) {
        if (values.includes(node.key)) {
          selectedKeys.push(node.key);
        }
        if (node.children) {
          traverseTree(node.children);
        }
      }
    };
    traverseTree(treeData);
    console.log(selectedKeys);
    setSelectedKeys(selectedKeys);
  };

  const handleSwitchChange = (checked) => {
    setSwitchStatus(checked);
  };

  const showUserInterface = () => {
    setUserInterface(true);
  }

  const onClose = () => {
    setUserInterface(false);
  };

  const onFinish = (values) => {

    if (switchStatus) {
      const formData = { selectedTags: selectedKeys };
      getGamesByTags(formData);
    } else {
      getGamesByDesc(values);
    }
  };


  const LoadingScreen = () => {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>
        <Spin size="large" />
      </div>
    );
  };

  const ContentScreen = () => {
    return (
      <Row gutter={[16, 16]}>
        {imageCols}
      </Row>
    );
  };


  useEffect(() => {
    getAllGamesData();
  }, [])

  // if (!allGamesData) {
  //   console.log("no game data")
  //   return (<div>Loading...</div>);

  // }
  // else {
  return (
    <div className="App">
      <Layout>
        <Layout>
          <Sider width={'18%'} style={siderInStyle}>
            <Layout>
              <Header style={sdierInHeaderStyle}>
                {/* <Search
                  placeholder="Game Name"
                  allowClear
                  size="large"
                /> */}
                <Select
                  showSearch
                  placeholder="Game Name"
                  value={searchValue}
                  onChange={handleSearch}
                  style={{ width: '100%', height: '80%', borderColor: 'black' }}
                  options={filteredOptions.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                />

              </Header>
              <Content style={sdierInContentStyle}>
                <Button icon={<SyncOutlined />} style={clearButtonStyle} size='large' type="primary" onClick={handleClearSelection}>
                  Reset filter
                </Button>
                <Flex gap="middle" justify={'flex-start'} align={'center'} >
                  <Switch checked={switchStatus} onChange={handleSwitchChange} />
                  <h3>
                    Self-Description/Tag-Select
                  </h3>
                </Flex>
                <Form onFinish={onFinish}>
                  <Form.Item name={'description'}>
                    <TextArea
                      disabled={switchStatus}
                      style={{ borderColor: 'black', resize: 'none' }}
                      rows={4}
                      maxLength={200}
                      showCount
                      value={description}
                      onChange={handleDescChange}
                    />
                  </Form.Item>

                  <Form.Item >
                    <Divider orientation="left">GameRecomendation By Tag</Divider>
                    <Select disabled={!switchStatus}
                      mode="multiple"
                      style={{ width: '100%', height: '12vh', borderColor: 'black', overflowY: 'auto' }}
                      placeholder="Please select"
                      value={searchTagValue}
                      onChange={handleTagSearch}
                      options={tagOption}
                    />
                  </Form.Item>

                  <Form.Item name={'selectedTags'}>
                    <Tree
                      disabled={!switchStatus}
                      style={{ overflowY: 'scroll', height: '50vh' }}
                      checkedKeys={selectedKeys}
                      // onSelect={onSelect}
                      checkable
                      onCheck={handleTreeCheck}
                      treeData={treeData}
                    />
                  </Form.Item>
                  <Button style={clearButtonStyle} htmlType='submit' size='large' type="primary">
                    Submit
                  </Button>
                </Form>
              </Content>
            </Layout>
          </Sider>
          <Layout>
            <Header style={mainHeaderStyle}>
              <h1>
                GAME RECOMENDATION SYSTEM
              </h1>
              <Select size='large'
                style={{ width: '10%', borderColor: 'black', }}
                value={rankMode}
                onChange={handleSelectChange}
                options={[
                  { value: 'Normal', label: 'Normal' },
                  { value: 'Most Popular', label: 'Most Popular' },
                  { value: 'positive feedback rate', label: 'positive feedback rate' },
                ]}
              />
            </Header>
            <Content style={mainContentStyle}>
              {isLoading ? <LoadingScreen /> : <ContentScreen />}
            </Content>
            <Footer style={mainFooterStyle}>
              <Pagination
                // total={allGamesData.length}
                total={recGameList == null ? 3740 : recGameList.length}
                showTotal={(total) => `Total ${total} items`}
                pageSizeOptions={[40, 80, 120, 160]}
                defaultPageSize={40}
                defaultCurrent={1}
                current={currentPage}
                onChange={onShowPageChange}
              />
            </Footer>
          </Layout>
        </Layout>
        <Sider width='18%' style={{ background: 'white', padding: '10px', paddingRight: '10px', height: '100vh', display: collapsedState ? "none" : "" }}>
          <Layout>
            <Header style={siderOutHeaderStyle}>
              <Flex gap="middle" justify={'flex-end'} align={'center'}>
                <Button type='primary' size='large' ghost={true} icon={<UserOutlined />} onClick={showUserInterface}>

                </Button>
                <Drawer width={450} placement="right" closable={false} onClose={onClose} open={userInterface}>
                  <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
                    User Profile
                  </p>
                  <p className="site-description-item-profile-p">Personal</p>
                  <Divider />
                </Drawer>
              </Flex>

            </Header>
            <Content style={siderOutContentStyle}>
              <Image
                style={{ borderRadius: '1%', width: '95%' }}
                src={selectedGame == null ? "" : selectedGame.image}
              />
              <br />
              <br />
              <h1>{selectedGame == null ? "" : selectedGame.name}</h1>
              <div >
                <Rate count={5}
                  value={5}
                  character={starIcon}
                  style={{ marginRight: '5px' }}
                />
                <Button className={`heart-button ${liked ? 'liked' : ''}`} onClick={handleClick} >
                  {liked ? (
                    <HeartFilled className="heart-icon" />
                  ) : (
                    <HeartOutlined className="heart-icon" />
                  )}
                </Button>
              </div>
              <div style={{ width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                {/* <Space style={{ marginTop: '10px' }} size={[0, 8]} wrap> */}
                {/* <Tag color="#55acee">
                  Action
                </Tag>
                <Tag color="#cd201f">
                  FPS
                </Tag>
                <Tag color="#3b5999">
                  Multiplayer
                </Tag>
                <Tag color="#55acee">
                  First Person Shooter
                </Tag>
                <Tag color="#3b5999">
                  Multiplayer
                </Tag>
                <Tag color="#55acee">
                  First Person Shooter
                </Tag>
                <Tag color="#3b5999">
                  Multiplayer
                </Tag>
                <Tag color="#55acee">
                  First Person Shooter
                </Tag> */}
                {/* </Space> */}

              </div>

              <div style={{ width: '95%' }}>
                <Divider orientation="left">Game Information</Divider>
                <List
                  header={<div>{selectedGame == null ? "" : selectedGame.description}</div>}
                  bordered
                  dataSource={hardWareReq == null ? "" : hardWareReq}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </div>

            </Content>
          </Layout>

        </Sider>


      </Layout>

    </div>
  );
}
// }

export default App;
