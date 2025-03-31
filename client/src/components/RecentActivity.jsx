import { Timeline, Card, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getNotes } from '@/api/noteApi';

const { Text } = Typography;

const RecentActivity = ({ userId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getNotes(userId);
        const notes = response.data;
        // 将笔记数据转换为活动记录，并按时间倒序排序
        const sortedActivities = notes
          .map((note) => ({
            id: note.id,
            title: note.title,
            type: 'create',
            time: new Date(note.created_at),
          }))
          .sort((a, b) => b.time - a.time)
          .slice(0, 5); // 只显示最近5条记录

        setActivities(sortedActivities);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };

    if (userId) {
      fetchActivities();
    }
  }, [userId]);

  const getIcon = (type) => {
    switch (type) {
      case 'create':
        return <PlusOutlined className="text-green-500" />;
      case 'update':
        return <EditOutlined className="text-blue-500" />;
      case 'delete':
        return <DeleteOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card
      title="最近笔记活动"
      className="mt-4 shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ maxHeight: '500px', overflowY: 'auto' }}
    >
      {activities.length > 0 ? (
        <Timeline
          className="px-2"
          items={activities.map((activity) => ({
            dot: getIcon(activity.type),
            children: (
              <div key={activity.id} className="mb-2">
                <Text strong className="text-base">
                  {activity.title}
                </Text>
                <br />
                <Text type="secondary" className="text-sm text-gray-500">
                  {activity.time.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </div>
            ),
          }))}
        />
      ) : (
        <Text type="secondary" className="text-gray-500">
          暂无活动记录
        </Text>
      )}
    </Card>
  );
};

export default RecentActivity;
