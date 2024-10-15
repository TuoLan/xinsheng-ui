import styles from "./index.module.scss"
import { Button, Form, Input, InputNumber, Select, message } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import service from "../../../request"
import { LeftOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../store/hooks';
import { UserInfoModel } from '../../../store/reducers/userReducer';

const { TextArea } = Input

type OrderModel = {
  _id?: string;
  bigNum: number;
  smallNum: number;
  status: "ordered" | "received" | "closed" | "completed";
  creater?: UserInfoModel,
  createdTime: string;
  reservationTime: any;
  paymentType: "hdfk",
  details?: string,
  reasonDetail?: string
}

type ResModel = {
  code: string;
  data: OrderModel;
  msg: string
}

const { Option } = Select;

function OrderDetail() {
  const currentDate = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const navigate = useNavigate()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const routeId = searchParams.get('id');
  const [saveOrder, setSaveOrder] = useState<OrderModel>()

  const maxPrice = userInfo?.userType === 'merchant' ? 1.8 : 3
  const minPrice = userInfo?.userType === 'merchant' ? 1.2 : 2

  const onFinish = (values: OrderModel) => {
    service.POST('/saveOrder', {
      ...saveOrder,
      ...values,
      reservationTime: dayjs(values?.reservationTime).toISOString()
    }).then((res) => {
      message.success(res.msg)
      navigate(-1)
    })
  }

  const onFinishFailed = () => { }

  const init = () => {
    service.GET('/getOrderDetail', { id: routeId }).then((res: ResModel) => {
      setSaveOrder({
        ...res.data,
        reservationTime: dayjs(res.data.reservationTime).format('YYYY-MM-DD HH:mm:ss')
      })
    })
  }

  const handleReasonInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSaveOrder(prevState => ({
      ...prevState,
      reasonDetail: event.target.value
    }) as OrderModel)
  }

  const handleProcess = (status: "ordered" | "received" | "closed" | "completed") => {
    onFinish({ ...saveOrder, status } as OrderModel)
  }

  const btns = () => {
    if (userInfo?.userType === 'admin') {
      if (saveOrder?.status === 'ordered') {
        return <>
          <Button className={styles.btn} variant="solid" onClick={() => handleProcess('closed')}>拒绝</Button>
          <Button className={styles.btn} color="primary" variant="solid" onClick={() => handleProcess('received')}>接单</Button>
        </>
      } else if (saveOrder?.status === 'received') {
        return <>
          <Button className={styles.btn} color="primary" variant="solid" onClick={() => handleProcess('completed')}>完成订单</Button>
        </>
      }
      return <></>
    } else {
      if (saveOrder?.status === 'ordered') {
        return <>
          <Button className={styles.btn} variant="solid" onClick={() => navigate(-1)}>取消</Button>
          <Button className={styles.btn} color="primary" variant="solid" htmlType="submit">保存</Button>
        </>
      } else if (saveOrder?.status === 'received') {
        return <>
          <Button className={styles.btn} color="primary" variant="solid" onClick={() => handleProcess('completed')}>完成订单</Button>
        </>
      }
      return <></>
    }
  }

  useEffect(() => {
    if (routeId !== "undefined") {
      init();
    } else {
      setSaveOrder({
        bigNum: 0,
        smallNum: 0,
        status: 'ordered',
        createdTime: '',
        reservationTime: null,
        paymentType: 'hdfk',
        creater: undefined
      })
    }
  }, []);
  return (
    <div className={styles.otherDetail}>
      <div className={styles.header}>
        <div className={styles.back} onClick={() => navigate(-1)} ><LeftOutlined /></div>
        <div className={styles.title}>订单管理</div>
      </div>
      {
        saveOrder &&
        (<Form
          className={styles.orderForm}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={saveOrder}
        >
          <div className={styles.help}>单价:大杯{maxPrice}元/杯，小杯{minPrice}元/杯。货值总和需大于20杯。</div>
          {
            saveOrder.creater ?
              <>
                <div className={styles.help}>下单人/商家：{saveOrder.creater.nickname}</div>
                <div className={styles.help}>联系方式：<a href={`tel:${saveOrder.creater.phoneNumber}`}>{saveOrder.creater.phoneNumber}</a></div>
                <div className={styles.help}>收货地址：{`${saveOrder.creater.address.province} ${saveOrder.creater.address.city} ${saveOrder.creater.address.area} ${saveOrder.creater.address.detail}`}</div>
                <div className={styles.help}>联系供应商：<a href='tel:19972952816'>19972952816</a></div>
              </> : <></>
          }
          <Form.Item<OrderModel>
            label="小杯："
            name="smallNum"
            tooltip={minPrice + "元/杯"}
          >
            <InputNumber min={0} addonAfter="杯" disabled={userInfo?.userType === 'admin' || saveOrder?.status !== 'ordered'} />
          </Form.Item>

          <Form.Item<OrderModel>
            label="大杯："
            name="bigNum"
            tooltip={maxPrice + "元/杯"}
          >
            <InputNumber min={0} addonAfter="杯" disabled={userInfo?.userType === 'admin' || saveOrder?.status !== 'ordered'} />
          </Form.Item>

          <Form.Item<OrderModel>
            label="付款方式："
            name="paymentType"
          >
            <Select
              placeholder="请选择"
              allowClear
              disabled
            >
              <Option value="hdfk">货到付款</Option>
            </Select>
          </Form.Item>

          <Form.Item<OrderModel>
            label="预约配送时间："
            name="reservationTime"
          >
            <Select
              placeholder="请选择"
              disabled={userInfo?.userType === "admin" || saveOrder?.status !== 'ordered'}
              allowClear
            >
              <Option value={currentDate + " 05:00:00"}>今天5:00</Option>
              <Option value={currentDate + " 12:00:00"}>今天12:00</Option>
              <Option value={currentDate + " 18:00:00"}>今天18:00</Option>
              <Option value={tomorrow + " 05:00:00"}>明天5:00</Option>
              <Option value={tomorrow + " 12:00:00"}>明天12:00</Option>
              <Option value={tomorrow + " 18:00:00"}>明天18:00</Option>
            </Select>
          </Form.Item>

          <Form.Item<OrderModel>
            label="备注："
            name="details"
          >
            <TextArea rows={3} placeholder="请输入" maxLength={50} disabled={userInfo?.userType === "admin" || saveOrder.status !== "ordered"} />
          </Form.Item>

          {
            userInfo?.userType === "admin" ?
              <Form.Item<OrderModel>
                label="供应商回复："
                name="reasonDetail"
              >
                <TextArea rows={3} placeholder="请输入" maxLength={50} onInput={handleReasonInput} />
              </Form.Item> : saveOrder.status !== "ordered" && saveOrder.reasonDetail ?
                <Form.Item<OrderModel>
                  label="供应商回复："
                  name="reasonDetail"
                >
                  <TextArea rows={3} placeholder="请输入" maxLength={50} onInput={handleReasonInput} disabled />
                </Form.Item> : <></>
          }

          <Form.Item>
            {btns()}
          </Form.Item>
        </Form>)
      }
    </div>
  )
}

export default OrderDetail