import { Navigate, Routes, Route, useNavigate } from "react-router-dom"
import styles from "./index.module.scss"
import Order from '../order';
import Mine from '../mine';
import OrderDetail from '../order/detail';
import { Dropdown, MenuProps } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Header from '@/components/header'

function Home() {
  const navigate = useNavigate()

  const items: MenuProps['items'] = [
    {
      key: 'order',
      label: (
        <div onClick={() => navigate('order')}>订单</div>
      ),
    },
    {
      key: 'mine',
      label: (
        <div onClick={() => navigate('mine')}>个人中心</div>
      ),
    },
    {
      key: 'logout',
      label: (
        <div onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>退出登陆</div>
      ),
    },
  ]

  return (
    <div className={styles.home}>
      {
        location.pathname !== "/index/orderDetail" && window.localStorage.getItem('isHeader') === 'true' &&
        <Header isBack={false} title="鑫盛冷饮">
          <Dropdown menu={{ items }} placement="bottomLeft">
              <MenuOutlined className={styles.ops} />
          </Dropdown>
          </Header>
      }
      <Routes>
        <Route path="/" element={<Navigate to="order" replace />} />
        <Route path="order" element={<Order />} />
        <Route path="mine" element={<Mine />} />
        <Route path="orderDetail" element={<OrderDetail />} />
      </Routes>
    </div>
  )
}

export default Home