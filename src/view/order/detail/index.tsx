import styles from "./index.module.scss"
import { Button, Form, InputNumber, Select, TimePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import service from "../../../request"
import { LeftOutlined } from '@ant-design/icons';

type AddressModel = {
  province: string;
  city: string;
  area: string;
  detail: string
}

type UserInfoModel = {
  _id: string;
  userType: "person" | "merchant" | "admin";
  username: string;
  password: string;
  createTime: string;
  nickname: string;
  phoneNumber: string;
  address: AddressModel
}

type OrderModel = {
  _id?: string;
  bigNum: number;
  smallNum: number;
  status: "ordered" | "completed";
  creater?: UserInfoModel,
  createdTime: string;
  reservationTime: any;
  paymentType: "hdfk"
}

type ResModel = {
  code: string;
  data: OrderModel;
  msg: string
}

const { Option } = Select;

function OrderDetail() {
  const navigate = useNavigate()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const routeId = searchParams.get('id');

  const [saveOrder, setSaveOrder] = useState<OrderModel>()

  const onFinish = (values: OrderModel) => {
    service.POST('/api/saveOrder', {
      ...saveOrder,
      ...values,
      reservationTime: values?.reservationTime.toISOString()
    }).then((res) => {
      message.success(res.msg)
      navigate(-1)
    })
  }

  const onFinishFailed = () => { }

  const init = () => {
    service.GET(`/api/getOrderDetail?id=${routeId}`).then((res: ResModel) => {
      setSaveOrder({
        ...res.data,
        reservationTime: dayjs(res.data.reservationTime)
      })
    })
  }

  const handleTimeChange = (time: Dayjs) => {
    setSaveOrder((prevState) => {
      if (!prevState) {
        return prevState; // 处理 prevState 为 undefined 的情况
      }
      return {
        ...prevState,
        reservationTime: time || null
      };
    });
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
          <Form.Item<OrderModel>
            label="大杯："
            name="bigNum"
          >
            <InputNumber min={0} addonAfter="杯" />
          </Form.Item>

          <Form.Item<OrderModel>
            label="小杯："
            name="smallNum"
          >
            <InputNumber min={0} addonAfter="杯" />
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
            <TimePicker
              placeholder="请选择"
              format={'HH:mm'}
              onChange={handleTimeChange}
            />
          </Form.Item>

          <Form.Item>
            <Button className={styles.btn} onClick={() => navigate(-1)}>
              取消
            </Button>
            <Button className={styles.btn} color="primary" variant="outlined" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>)
      }
    </div>
  )
}

export default OrderDetail