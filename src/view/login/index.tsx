import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import styles from "./index.module.scss"
import { useNavigate } from 'react-router-dom';
import service from "../../request"
import { useAppDispatch } from '../../store/hooks';
import { setUserInfo, UserInfoModel } from '../../store/reducers/userReducer';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    service.POST('/api/login', values).then((res) => {
      localStorage.setItem("token", res.data);
      service.GET('/api/userInfo').then((res: { code: string; msg: string; data: UserInfoModel }) => {
        const datas = {
          ...res.data,
          address: res.data.address || {
            province: "湖北省",
            city: "孝感市",
            area: "大悟县",
            detail: ""
          }
        }
        dispatch(setUserInfo(datas));
        navigate('/index')
      })
    })
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={styles.login}>
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
          <Input placeholder='请输入手机号/邮箱' />
        </Form.Item>

        <Form.Item<FieldType>
          label="密码："
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password placeholder='请输入密码' />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
        >
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button className={styles.register} onClick={() => navigate('/register')}>
            注册
          </Button>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login