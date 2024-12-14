import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../static/css/login.css';


message.config({
  top: 50
});

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      message.success('登录成功');
      // navigate('/Write');
    } catch (error) {
      message.error('登录失败: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <Card
        className="login-card"
        bordered={false}
      >
        <h1 className="login-title">欢迎回来</h1>
        <p className="login-subtitle">请登录您的账号</p>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="用户名"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="密码"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
