import styles from "./index.module.scss";
import dayjs from 'dayjs';
import { UserInfoModel } from '../../store/reducers/userReducer';

const statusMap = {
  all: "全部",
  ordered: "已下单",
  received: "已接单",
  closed: "已关闭",
  completed: "已完成"
};

const userTypeMap: Record<string, string> = {
  person: '个人订单',
  merchant: '商家订单'
};

const paymentTypeMap = {
  hdfk: "货到付款"
};

// 定义订单的类型
export type OrderModel = {
  _id: string;
  bigNum?: number;
  smallNum?: number;
  status: "all" | "ordered" | "received" | "closed" | "completed";
  creater: UserInfoModel;
  createdTime: string;
  reservationTime: string;
  paymentType: "hdfk";
};

// 定义 props 类型
interface OrderItemProps {
  item: OrderModel;
  userInfo: UserInfoModel | null;
  handelGoEdit: (id: string) => void;
}

function OrderItem(props: OrderItemProps) {
  const { item, userInfo, handelGoEdit } = props;
  return (
    <div className={styles.orderItem} onClick={() => handelGoEdit(item._id)}>
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
      <div>收货地址：{`${item.creater.address.province} ${item.creater.address.city} ${item.creater.address.area} ${item.creater.address.detail}`}</div>
    </div>
  );
}

export default OrderItem;
