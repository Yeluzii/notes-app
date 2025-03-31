import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, FolderOutlined } from '@ant-design/icons';
import { getNotes } from '@/api/noteApi';
import { getCategories } from '@/api/categoryApi';

const StatisticCards = ({ userId }) => {
  const [notesCount, setNotesCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const [notesRes, categoriesRes] = await Promise.all([
            getNotes(userId),
            getCategories(),
          ]);
          setNotesCount(notesRes.data.length);
          setCategoriesCount(categoriesRes.data.length);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <Statistic
            title="笔记总数"
            value={notesCount}
            prefix={<FileTextOutlined className="text-green-600" />}
            valueStyle={{ color: '#3f8600' }}
            className="text-lg"
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <Statistic
            title="分类总数"
            value={categoriesCount}
            prefix={<FolderOutlined className="text-blue-500" />}
            valueStyle={{ color: '#1890ff' }}
            className="text-lg"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticCards;
