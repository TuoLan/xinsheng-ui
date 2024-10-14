import { useState } from "react";
import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import styles from "./index.module.scss"
import { useNavigate } from 'react-router-dom';
import service from "../../request"

type FieldType = {
  username?: string;
  phoneNumber?: string;
  verifCode?: string;
  password?: string;
};

function Register() {
  let phoneStr = ''
  const [secondNum, setSecondNum] = useState<number>(90)
  const navigate = useNavigate()
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    service.POST('/register', values).then(() => {
      navigate('/login')
    })
  };

  const handleInput = (event: any) => {
    phoneStr = event.target.value
  }

  const sendCode = () => {
    const phonePattern = /^1[3-9]\d{9}$/;
    if (!phonePattern.test(phoneStr)) {
      message.warning('请输入正确手机号！')
      return
    }
    if (secondNum === 90) {
      service.POST('/getVerifCode', { phoneNumber: phoneStr }).then(() => {
        let intervalId = setInterval(() => {
          setSecondNum(prevSecondNum => {
            if (prevSecondNum <= 1) {
              clearInterval(intervalId);
              return 90; // 重置秒数
            }
            return prevSecondNum - 1;
          });
        }, 1000);
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const sendCodeBtn = (
    secondNum === 90 ? (
      <div onClick={sendCode}>发送验证码</div>
    ) : (
      <div>{secondNum}秒后重新发送</div>
    )
  );

  return (
    <div className={styles.register}>
      <div className={styles.header}>
        <div className={styles.title}>鑫盛冷饮</div>
      </div>
      <Form
        className={styles.basicForm}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="用户名："
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input placeholder='请输入用户名' />
        </Form.Item>

        <Form.Item<FieldType>
          label="手机号"
          name="phoneNumber"
          rules={[{ required: true, message: '请输入手机号!' }]}
        >
          <Input placeholder='请输入手机号' onInput={handleInput} addonAfter={sendCodeBtn} />
        </Form.Item>

        <Form.Item<FieldType>
          label="验证码："
          name="verifCode"
          rules={[{ required: true, message: '请输入验证码!' }]}
        >
          <Input placeholder='请输入验证码' />
        </Form.Item>

        <Form.Item<FieldType>
          label="密码："
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password placeholder='请输入密码' />
        </Form.Item>

        <Form.Item>
          <span className={styles.goLogin} onClick={() => navigate(-1)} >已注册去登陆</span>
          <Button htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Register