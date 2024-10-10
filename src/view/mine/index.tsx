import styles from "./index.module.scss"
import { Button, Form, Input, message, Collapse } from 'antd';
import { useState, useEffect } from "react";
import service from "../../request"
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setUserInfo, UserInfoModel } from '../../store/reducers/userReducer';

const { Panel } = Collapse;

function Mine() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user.userInfo) as UserInfoModel
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [saveData, setSaveData] = useState<UserInfoModel>()
  const onFinish = (datas: UserInfoModel) => {
    service.POST('/api/updateUserInfo', {
      ...datas
    }).then((res) => {
      message.success(res.msg)
      setIsEdit(false)
      dispatch(setUserInfo(datas));
    })
  }
  const onFinishFailed = () => { }

  useEffect(() => {
    setSaveData(userInfo)
  }, []);

  return (
    <div className={styles.mine}>
      {saveData && (
        <Form
          className={styles.basicForm}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={saveData}
        >
          <Form.Item<UserInfoModel>
            label="用户名："
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder='请输入手机号/邮箱' disabled />
          </Form.Item>

          <Form.Item<UserInfoModel>
            label="商家名："
            name="nickname"
          >
            <Input placeholder='请输入' disabled={!isEdit} />
          </Form.Item>

          <Form.Item<UserInfoModel>
            label="联系方式："
            name="phoneNumber"
          >
            <Input placeholder='请输入手机号' disabled={!isEdit} />
          </Form.Item>

          <Collapse defaultActiveKey={['1']}>
            <Panel header="收货地址" key="1">
              <Form.Item label="省" name={['address', 'province']}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="市" name={['address', 'city']}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="区/县" name={['address', 'area']}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="详细地址" name={['address', 'detail']}>
                <Input disabled={!isEdit} />
              </Form.Item>
            </Panel>
          </Collapse>

          <Form.Item>
            {
              isEdit ?
                <Button className={styles.btn} type="primary" htmlType="submit">
                  提交
                </Button> :
                <Button className={styles.btn} onClick={(e) => {
                  e.preventDefault(); // 阻止默认行为
                  setIsEdit(true);
                }}>
                  编辑
                </Button>
            }
          </Form.Item>
        </Form>
      )}
    </div>
  )
}

export default Mine