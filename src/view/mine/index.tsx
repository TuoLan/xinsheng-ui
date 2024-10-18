import styles from "./index.module.scss";
import { Button, Form, Input, Upload, message, Collapse, Dropdown, MenuProps } from 'antd';
import { UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import service from "../../request";
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setUserInfo, UserInfoModel } from '../../store/reducers/userReducer';

function Mine() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user.userInfo) as UserInfoModel;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [saveData, setSaveData] = useState<UserInfoModel>();
  const [myFileList, setMyFileList] = useState<any[]>([]);

  const onFinish = (datas: UserInfoModel) => {
    service.POST('/updateUserInfo', {
      ...datas,
      businessLicense: saveData?.businessLicense // 更新数据库中的信息
    }).then((res) => {
      message.success(res.msg);
      setIsEdit(false);
      dispatch(setUserInfo(res.data));
    });
  };

  const onFinishFailed = () => { };

  // 处理文件选择
  const handleFileChange = (info: any) => {
    const { fileList } = info;
    setMyFileList(fileList); // 将选中的文件保存到状态中
    const formData = new FormData();

    // 确保有文件被选中
    if (fileList.length > 0) {
      formData.append('file', fileList[0].originFileObj);

      service.POST('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then((res) => {
        setSaveData(prevState => ({
          ...prevState,
          businessLicense: res.data // 假设这是文件的 URL
        }) as UserInfoModel);
      }).catch(() => {
        setMyFileList([]); // 上传失败，清空文件列表
      });
    }
  };

  const optItems: MenuProps['items'] = [
    {
      key: 'order',
      label: (
        <div onClick={() => navigate('/index/order')}>订单</div>
      ),
    },
    {
      key: 'logout',
      label: (
        <div onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>退出登陆</div>
      ),
    },
  ];

  const items = [
    {
      key: '1',
      label: '收货地址',
      children: (
        <>
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
        </>
      ),
    }
  ];

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>点击上传</div>
    </button>
  );

  useEffect(() => {
    setSaveData(userInfo);
  }, [userInfo]);

  // 在 saveData.businessLicense 有值时设置文件列表
  useEffect(() => {
    if (saveData?.businessLicense) {
      setMyFileList([{
        uid: '-1', // 可以是任何唯一的 uid
        name: saveData.businessLicense.split('/').pop(), // 从 URL 中获取文件名
        status: 'done', // 上传状态
        url: saveData.businessLicense // 文件的 URL
      }]);
    }
  }, [saveData]);

  return (
    <div className={`${styles.mine} ${window.localStorage.getItem('isHeader') === 'false' && styles.bigmine}`}>
      {window.localStorage.getItem('isHeader') === 'false' && <Dropdown menu={{ items: optItems }} placement="bottomLeft">
        <span className={styles.options}>
          <UnorderedListOutlined />
        </span>
      </Dropdown>}
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

          <Form.Item<UserInfoModel>
            label="营业执照："
            name="businessLicense"
          >
            <Upload
              listType="picture-card"
              disabled={!isEdit}
              beforeUpload={() => false} // 阻止默认上传行为
              onChange={handleFileChange}
              fileList={myFileList} // 使用动态更新的文件列表
              maxCount={1} // 限制只能选择一个文件
            >
              {myFileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Collapse key={isEdit + ''} defaultActiveKey={isEdit ? ['1'] : []} items={items} />

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
  );
}

export default Mine;
