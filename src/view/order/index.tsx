import styles from "./index.module.scss"
import { Button, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import service from "../../request"
import dayjs from 'dayjs';
import { useAppSelector } from '../../store/hooks';
import { UserInfoModel } from '../../store/reducers/userReducer';

type OrderModel = {
  _id: string;
  bigNum?: number;
  smallNum?: number;
  status: "all" | "ordered" | "received" | "closed" | "completed";
  creater: UserInfoModel,
  createdTime: any;
  reservationTime: any;
  paymentType: "hdfk"
}

type ResModel = {
  code: string;
  data: OrderModel[];
  msg: string
}

const statusMap = {
  all: "全部",
  ordered: "已下单",
  received: "已发货",
  closed: "已关闭",
  completed: "已完成"
}

const paymentTypeMap = {
  hdfk: "货到付款"
}

function Order() {
  const navigate = useNavigate()
  const [orderList, setOrderList] = useState<OrderModel[]>([])
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const handelGoEdit = (id?: string) => {
    navigate(`/index/orderDetail?id=${id}`)
  }

  const handleTabChange = (val: string) => {
    init(val)
  }

  const btn = userInfo?.userType !== 'admin' && (
    <Button color="primary" variant="outlined" size="small" className={styles.add} onClick={(e) => {
      e.preventDefault(); // 阻止默认行为
      handelGoEdit();
    }}>
      新建订单
    </Button>
  )

  const init = async (status?: string) => {
    const url = !!status ? `/api/getOrderList?status=${status}` : '/api/getOrderList'
    const orderListResp: ResModel = await service.GET(url)
    setOrderList(orderListResp.data)
  }
  useEffect(() => {
    init();
  }, []);
  return (
    <div className={styles.order}>
      <div className={styles.ops}>
        <Tabs defaultActiveKey="all" className={styles.orderTabs} tabBarExtraContent={btn} size="small" items={[
          { label: '全部', key: 'all' },
          { label: '已下单', key: 'ordered' },
          { label: '已接单', key: 'received' },
          { label: '已关闭', key: 'closed ' },
          { label: '已完成', key: 'completed' }
        ]} onChange={handleTabChange} />
      </div>
      <div className={styles.orderLayout}>
        {
          orderList.map(item => {
            return (
              <div className={styles.orderItem} key={item._id} onClick={() => handelGoEdit(item._id)}>
                <div className={`${styles.status} ${styles[item.status || 'all']}`}>{statusMap[item.status || "all"]}</div>
                <div>大杯：{item.bigNum}杯</div>
                <div>小杯：{item.smallNum}杯</div>
                <div>付款方式：{paymentTypeMap[item.paymentType]}</div>
                <div>下单人/商家：{item.creater.nickname}</div>
                <div>联系方式：{item.creater.phoneNumber}</div>
                <div>下单时间：{dayjs(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>预约配送时间：{dayjs(item.reservationTime).format('YYYY-MM-DD HH:mm')}</div>
                <div>收货地址：{`${item.creater.address.province} ${item.creater.address.city} ${item.creater.address.area} ${item.creater.address.detail}`}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Order