import { Navigate, Routes, Route, useNavigate } from "react-router-dom"
import styles from "./index.module.scss"
import Order from '../order';
import Mine from '../mine';
import OrderDetail from '../order/detail';
import { Dropdown, MenuProps } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';

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
  ]

  return (
    <div className={styles.home}>
      {
        location.pathname !== "/index/orderDetail" &&
        <div className={styles.header}>
          <div className={styles.title}>鑫盛冷饮</div>
          <Dropdown menu={{ items }} placement="bottomLeft">
            <UnorderedListOutlined />
          </Dropdown>
        </div>
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