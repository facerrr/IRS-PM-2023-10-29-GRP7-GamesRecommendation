import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import tag from './tag'


import { Layout, Button, Input, Card, Tree, Col, Row, Select, Space, Form, Pagination, Image, Rate, Tag, Carousel } from 'antd';
import { DataNode, TreeProps } from 'antd/es/tree';
import { AudioOutlined, SyncOutlined } from '@ant-design/icons';
import axios, { all } from 'axios'
// const { Database } = require('sqlite3');
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';

const viewportWidth = window.innerWidth;
const pixelSiderOut = 0.18 * viewportWidth;
const pixelSiderIn = 0.12 * viewportWidth;


const { Header, Footer, Sider, Content } = Layout
const { Search } = Input;
const { TextArea } = Input;
const dbPath = 'D:/Desktop/Common/APP/irs/src/game_data2.db';
var showlist=[];
// const sqlite3 = require('sqlite3').verbose();

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1677ff',
      width: 200
    }}
  />
);
const headerStyle = {
  background: 'yellow',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px',
  paddingRight: '50px',
  backgroundColor: 'white',
  height: '5vh',
}
const siderInStyle = {
  background: 'white',
  color: 'Blue',
  // marginTop: '20px',
  padding: '10px',
  paddingRight: '20px',
  height: '95vh',
  overflowY: 'scroll',
}
const siderOutStyle = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  paddingTop: '80px',
  fontSize: '20px',
  fontFamily: 'Arial'

  // marginTop:'100px'
}

const CardStyle = {
  marginLeft: '10px',
  borderColor: 'black',
  fontSize: '15px',
  width: '95%'
}

const contentInStyle = {
  background: 'white',
  padding: '10px',
  paddingRight: '10px',
  overflowY: 'auto',
  height: '90vh',
}

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: 'white',
  height: '5vh',
};

const nameSearchStyle = {
  width: '14%',
  // padding: '12px 10px 12px 0px'
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

const classes = ['Free to Play', 'RPG', 'Simulation', 'Sports', 'Adventure', 'Strategy', 'Casual', 'Indie', 'Massively Multiplayer', 'Early Access', 'Racing']
const class_node = []
const tag_node = []
for (let i = 0; i < classes.length; i++) {
  class_node.push(
    {
      title: classes[i],
      key: '0-0-' + i,
      checkable: true,
    },
  )
}

for (let i = 0; i < tag.length; i++) {
  tag_node.push(
    {
      title: tag[i],
      key: '0-1-' + i,
      checkable: true,
    },
  )
}
const treeData = [
  {
    title: 'class',
    key: '0-0',
    checkable: false,
    children: class_node
  },
  {
    title: 'tag',
    key: '0-1',
    checkable: false,
    children: tag_node
  },
];


function App() {

  const [allGamesData, setAllGamesData] = useState(null);    //no rank
  const [sorGamesData, setSortGamesData] = useState([]);   //rank by positive_evaluation_rate
  // const [showlist, setShowlist] = useState(null);
  const [imgSrcs, setImgSrcs] = useState([]);
  const [gameNames, setGameNames] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [imageCols, setImageCols] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [tagSearch, setTagSearch] = useState([]);
  const [description, setDescription] = useState("");
  const contentRef = useRef();
  const [colCount, setColCount] = useState(4);
  const [detailGameInfo, setDetailGameInfo] = useState(['https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg?t=1696513856', 'Counter-Strike 2']);
  // var showlist = []
  const [clickTime, setClickTime] = useState(0);

  const getAllGamesData = () => {
    axios.get('/getAllGame')
      .then(response => {
        const data = response.data;
        setAllGamesData(data);
        loadImage(1, 20, data);
        // setShowlist(data);
        showlist = data
        //data process
        const _arr = Object.entries(data);
        const sortedArray = _arr.sort((a, b) => {
          const rateA = a[1].positive_evaluation_rate;
          const rateB = b[1].positive_evaluation_rate;
          return rateB - rateA;
        });
        const sortedData = sortedArray.map(([_, obj]) => obj);
        setSortGamesData(sortedData);
      })
      .catch(error => {
        // 处理请求错误
        console.error(error);
      });

  };

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
          <Col onClick={() => handleCardClick((current - 1) * pageSize + i)} span={24 / 4} offset={0.5} >
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
    setImageCols(_imgColsTemp);
  }

  const reset = () => {

  }

  // const calculateColumns = () => {
  //   if (contentWidth >= 1200) {
  //     return 4;
  //   } else if (contentWidth >= 800) {
  //     return 3; 
  //   } else if (contentWidth >= 600) {
  //     return 2; 
  //   } else {
  //     return 1;
  //   }
  // };


  //page变化的回调
  const onShowPageChange = (current, size) => {
    setCurrentPage(current);
    setCurrentPageSize(size);
    console.log("PageChange");
    loadImage(current, size, showlist);
    console.log(showlist);
  };

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  const handleCheck = (key, e) => {
    setSelectedKeys(key);
    console.log(key);
  };

  const handleClearSelection = () => {
    setSelectedKeys([]);
    if (contentRef.current) {
      const contentWidth = contentRef.current.offsetWidth;
      console.log('Content Width:', contentWidth);
    }
    // getAllGamesData();
    console.log(allGamesData);
    setClickTime(clickTime+1);
  };

  const handleSelectChange = (value) => {
    console.log(`selected ${value}`);
    console.log(value);
    showlist = (value == 0 ? allGamesData : sorGamesData);
    // setShowlist(value == 0 ? allGamesData : sorGamesData);
    setCurrentPage(1);
    loadImage(1, currentPageSize, value == 0 ? allGamesData : sorGamesData);
  };

  const handleCardClick = (key) => {
    console.log(key);
    setDetailGameInfo([showlist[key].image, showlist[key].name]);
  }

  useEffect(() => {
    const getData = async () => {
      getAllGamesData();

    };
    getData();
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const contentWidth = entry.contentRect.width;
        const oldCount = colCount;
        const newColCount = Math.floor(contentWidth / 438);
        setColCount(newColCount);
        if (oldCount != newColCount && !showlist) {
          // loadImage(currentPage,currentPageSize,showlist)
          //问题showlist经常为空
        }
      }
    });
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
    

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
          <Header style={headerStyle}>
            <Search style={nameSearchStyle}
              placeholder="Game Name"
              allowClear
              enterButton="Search"
              size="large"
            />
            <h1>
              GAME RECOMENDATION SYSTEM
            </h1>
            <Select size='large'
              defaultValue="1"
              style={{ width: '10%', borderColor: 'black', }}
              onChange={handleSelectChange}
              options={[
                { value: 0, label: 'Normal' },
                { value: 1, label: 'Most Popular' },
              ]}
            />
          </Header>
          <Layout>
            <Sider width={`${pixelSiderIn}px`} style={siderInStyle}>
              <Button icon={<SyncOutlined />} style={clearButtonStyle} size='large' type="primary" onClick={handleClearSelection}>
                Reset filter
              </Button>
              <br />
              <br />
              {/* <FORM>
                <FORM.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <FORM.Label>Example textarea</FORM.Label>
                  <FORM.Control as="textarea" rows={3} />
                </FORM.Group>
                <FORM.Group>
                </FORM.Group>
              </FORM> */}
              <Form>
                <Form.Item>
                  <br />
                  <br />
                  <TextArea style={boder} rows={4} />
                </Form.Item>
                <Button style={clearButtonStyle} size='large' type="primary">
                  Submit
                </Button>
                <Form.Item>
                  <br />
                  <br />
                  <Tree checkable defaultExpandedKeys={['0-0', '0-1', '0-2', '0-3']}
                    checkedKeys={selectedKeys}
                    // defaultSelectedKeys={['0-0-0', '0-0-1']}
                    // defaultCheckedKeys={['0-0-0', '0-0-1']}
                    // onSelect={onSelect}
                    onCheck={handleCheck}
                    treeData={treeData}
                  />
                </Form.Item>
              </Form>
            </Sider>
            <Layout>
              <Content ref={contentRef} style={contentInStyle}>
                <Row gutter={[16, 16]}>
                  {imageCols}
                </Row>
              </Content>
              <Footer style={footerStyle}>
                <Pagination
                  // total={allGamesData.length}
                  total={3840}
                  showTotal={(total) => `Total ${total} items`}
                  pageSizeOptions={[10, 20, 40, 80, 120]}
                  defaultPageSize={20}
                  defaultCurrent={1}
                  current={currentPage}
                  onChange={onShowPageChange}
                />
              </Footer>
            </Layout>

          </Layout>
        </Layout>
        <Sider width={`${pixelSiderOut}px`} style={siderOutStyle}>
          <Image
            style={{ borderRadius: '1%', width: '95%' }}
            src={detailGameInfo[0]}
          />
          {/* <img src={'https://wallpapercave.com/wp/wp6490338.png'} >
                  </img> */}
          <br />
          <br />
          <div style={{ textAlign: 'center' }}>
            <h1>{detailGameInfo[1]}</h1>
            {/* <Space>
              <Rate disabled defaultValue={1} />
              <Rate disabled defaultValue={1} />
              <Rate disabled defaultValue={1} />
              <Rate disabled defaultValue={1} />
              <Rate disabled defaultValue={1} />
              <Rate disabled defaultValue={1} />
            </Space> */}
            <Rate disabled defaultValue={5} />
            <p>GAMESIZE : `Total ${clickTime} items`</p>
            <p>GAMETAG</p>
            <Space size={[0, 8]} wrap>
              <Tag color="#55acee">
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
            </Space>
          </div>
          <br />
          <Card title="GAME DESCRITION" hoverable bordered={true} style={CardStyle}>
            Valorant is set in a near-future Earth, where factions known as "Agents" battle it out in various game modes. The objective of the game is to either plant or defuse a bomb, known as the "Spike," within a specific time frame. The game combines elements of tactical shooters with the fast-paced action of traditional FPS games.
          </Card>
        </Sider>
      </Layout>

    </div>
  );
}
// }

export default App;
