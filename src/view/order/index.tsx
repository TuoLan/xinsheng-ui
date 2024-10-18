import styles from "./index.module.scss"
import { Button, Tabs, Empty, Dropdown, MenuProps } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import service from "../../request"
import { useAppSelector } from '../../store/hooks';
import OrderItem, { OrderModel } from './order-item'

type PaginateModel = {
  data: OrderModel[],
  total: number
}

type ResModel = {
  code: string;
  data: PaginateModel;
  msg: string
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

  const items: MenuProps['items'] = [
    ...(userInfo?.userType !== 'admin' ? [{
      key: 'addorder',
      label: (
        <div onClick={() => navigate('/index/orderDetail?id=undefined')}>新建订单</div>
      ),
    }] : []),
    {
      key: 'mine',
      label: (
        <div onClick={() => navigate('/index/mine')}>个人中心</div>
      ),
    },
    {
      key: 'logout',
      label: (
        <div onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>退出登陆</div>
      ),
    },
  ]

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

  const options = window.localStorage.getItem('isHeader') === 'false' ?
    (<Dropdown menu={{ items }} placement="bottomLeft">
      <span className={styles.options}>
        <UnorderedListOutlined />
      </span>
    </Dropdown>) : btn

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
        <Tabs defaultActiveKey="all" className={styles.orderTabs} tabBarExtraContent={options} size="small" items={[
          { label: '全部', key: 'all' },
          { label: '已下单', key: 'ordered' },
          { label: '已接单', key: 'received' },
          { label: '已关闭', key: 'closed' },
          { label: '已完成', key: 'completed' }
        ]} onChange={handleTabChange} />
      </div>
      <div className={`${styles.orderLayout} ${window.localStorage.getItem('isHeader') === 'false' && styles.bigorderLayout}`} ref={scrollableRef}>
        {
          orderList.length ?
            orderList.map(item => (
              <OrderItem key={item._id} item={item} userInfo={userInfo} handelGoEdit={handelGoEdit} />
            )) :
            <Empty />
        }
      </div>
    </div>
  );
}

export default Order;
