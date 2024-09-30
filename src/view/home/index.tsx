import { useState, useEffect } from 'react';
import { Navigate, Routes, Route, useNavigate } from "react-router-dom"
import styles from "./index.module.scss"
import service from "../../request"
import Order from '../order';
import Mine from '../mine';
import { Dropdown, MenuProps } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';

type UserInfoModel = {
  createTime: string;
  exp: number;
  iat: number;
  password: string;
  username: string;
  _id: string
}

type ResModel = {
  code: string;
  data: UserInfoModel;
  msg: string
}

function Home() {
  const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(undefined);
  const navigate = useNavigate()
  const init = () => {
    service.GET('/api/userInfo').then((res: ResModel) => {
      setUserInfo(res?.data)
    })
  }
  useEffect(() => {
    init();
  }, []);


  const handleChange = (type: string) => {
    console.log(type);
    navigate(type)
  }

  const items: MenuProps['items'] = [
    {
      key: 'order',
      label: (
        <div onClick={() => handleChange('order')}>订单</div>
      ),
    },
    {
      key: 'mine',
      label: (
        <div onClick={() => handleChange('mine')}>我的</div>
      ),
    },
  ]

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <div className={styles.title}>鑫盛冷饮</div>
        <Dropdown menu={{ items }} placement="bottomLeft">
          <UnorderedListOutlined />
        </Dropdown>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="order" replace />} />
        <Route path="order" element={<Order />} />
        <Route path="mine" element={<Mine />} />
      </Routes>
    </div>
  )
}

export default Home