import { Layout, Typography, Space } from 'antd';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import StatisticCards from '@/components/StatisticCards';
import RecentActivity from '@/components/RecentActivity';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const { user } = useStore();

  return (
    <Layout className="h-screen">
      <Navbar />
      <Content className="p-6 bg-#dff">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {user ? (
            <>
              <Title level={2}>欢迎, {user.nickname || user.username}</Title>
              <StatisticCards userId={user.id} />
              <RecentActivity userId={user.id} />
            </>
          ) : (
            <Title level={2}>欢迎来到笔记应用</Title>
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default Home;
