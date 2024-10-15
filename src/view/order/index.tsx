import styles from "./index.module.scss"
import { Button, Tabs, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
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

type PaginateModel = {
  data: OrderModel[],
  total: number
}

type ResModel = {
  code: string;
  data: PaginateModel;
  msg: string
}

const statusMap = {
  all: "全部",
  ordered: "已下单",
  received: "已接单",
  closed: "已关闭",
  completed: "已完成"
}

const userTypeMap: any = {
  person: '个人订单',
  merchant: '商家订单'
}

const paymentTypeMap = {
  hdfk: "货到付款"
}

function Order() {
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState<OrderModel[]>([]);
  const [page, setPage] = useState<number>(1); // 当前页码
  const [loading, setLoading] = useState<boolean>(false); // 是否正在加载
  const [hasMore, setHasMore] = useState<boolean>(true); // 是否有更多数据
  const [status, setStatus] = useState<string>('all'); // 当前状态
  const scrollableRef = useRef<HTMLDivElement | null>(null); // 引用 DOM 元素
  const userInfo = useAppSelector((state) => state.user.userInfo);

  // 处理新建订单
  const handelGoEdit = (id?: string) => {
    navigate(`/index/orderDetail?id=${id}`);
  };

  // 处理 Tabs 切换
  const handleTabChange = (val: string) => {
    setStatus(val); // 更新状态
    setPage(1); // 重置页码
    setOrderList([]); // 清空订单列表
    setHasMore(true); // 重置是否有更多数据的状态
  };

  const btn = userInfo?.userType !== 'admin' && (
    <Button color="primary" variant="outlined" size="small" className={styles.add} onClick={(e) => {
      e.preventDefault();
      handelGoEdit();
    }}>
      新建订单
    </Button>
  );

  // 初始化加载订单数据
  const init = async (page: number, pageSize: number, status?: string): Promise<OrderModel[]> => {
    const statusObj = status ? { status } : {};
    const orderListResp: ResModel = await service.GET('/getOrderList', {
      page,
      pageSize,
      ...statusObj,
    });
    return orderListResp.data.data; // 返回订单数据
  };

  // 加载更多订单
  const loadMoreOrders = async (): Promise<void> => {
    if (loading) return;
    setLoading(true);

    const newOrders = await init(page, 6, status); // 加载当前页订单
    if (newOrders.length === 0) {
      setHasMore(false); // 如果没有更多数据，停止加载
    } else {
      setOrderList((prevOrders) => [...prevOrders, ...newOrders]); // 合并新数据
      setPage(page + 1); // 更新下一页页码
    }

    setLoading(false);
  };

  // 初始加载第一页数据
  useEffect(() => {
    loadMoreOrders(); // 加载第一页数据
  }, [status]); // 依赖 status，切换 Tabs 时重新加载数据

  // 滚动监听
  useEffect(() => {
    const element = scrollableRef.current;
    if (!element) return;

    const handleScroll = () => {
      if (loading || !hasMore) return;

      // 判断是否滚动到底部
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        loadMoreOrders(); // 滚动到底部时加载更多订单
      }
    };

    element.addEventListener('scroll', handleScroll);

    // 清理函数，组件卸载时移除事件监听器
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

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
      <div className={styles.orderLayout} ref={scrollableRef}>
        {
          orderList.length ?
            orderList.map(item => (
              <div className={styles.orderItem} key={item._id} onClick={() => handelGoEdit(item._id)}>
                <div className={`${styles.status} ${styles[item.status || 'all']}`}>
                  {userInfo?.userType === 'admin' ?
                    userTypeMap[item.creater.userType] + '-' + statusMap[item.status || "all"] :
                    statusMap[item.status || "all"]}
                </div>
                <div>小杯：{item.smallNum}杯</div>
                <div>大杯：{item.bigNum}杯</div>
                <div>付款方式：{paymentTypeMap[item.paymentType]}</div>
                <div>下单人/商家：{item.creater.nickname}</div>
                <div>联系方式：<a href={`tel:${item.creater.phoneNumber}`}>{item.creater.phoneNumber}</a></div>
                <div>预约配送时间：{dayjs(item.reservationTime).format('MM月DD日 HH:mm')}</div>
                {/* <div>下单时间：{dayjs(item.createdTime).format('YYYY年MM月DD日 HH:mm:ss')}</div> */}
                <div>收货地址：{`${item.creater.address.province} ${item.creater.address.city} ${item.creater.address.area} ${item.creater.address.detail}`}</div>
              </div>
            )) :
            <Empty />
        }
      </div>
    </div>
  );
}

export default Order;
