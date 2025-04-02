import { DeleteFilled } from '@ant-design/icons';
import { Table, Button, Space, Spin, message, Layout, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { getTrashNotes, deleteNote, restoreNote } from '../api/noteApi';
import { useStore } from '@/store/userStore';
import Navbar from '../components/Navbar';

const TrashPage = () => {
  const { user } = useStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState('');
  const [deleteLoding, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getTrashNotes(user.id);
      setData(response.data);
    } catch (error) {
      message.error('获取回收站数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (noteId) => {
    try {
      await restoreNote(noteId);
      message.success('恢复成功');
      fetchData();
    } catch (error) {
      message.error('恢复失败');
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      message.success('笔记已永久删除');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '内容', dataIndex: 'content', key: 'content' },
    { title: '分类', dataIndex: 'category_id', key: 'category' },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleRestore(record.id)}>
            恢复
          </Button>
          <Button
            danger
            onClick={(e) => {
              setModalVisible(true);
              setSelectedNoteId(record.id);
              setSelectedNoteTitle(record.title);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="h-screen">
      <Navbar />
      <h1 className="m-5">
        <DeleteFilled style={{ marginRight: 8 }} />
        回收站
      </h1>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
        />
      </Spin>
      <Modal
        open={modalVisible}
        onOk={async () => {
          try {
            await handleDelete(selectedNoteId);
            fetchData();
          } catch (error) {
            message.error('删除失败!');
          } finally {
            setModalVisible(false);
            setSelectedNoteId(null);
            setDeleteLoading(false);
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setSelectedNoteId(null);
        }}
        confirmLoading={deleteLoding}
      >
        <p>确定要永久删除 {selectedNoteTitle} 这条笔记吗？不可恢复！！！</p>
      </Modal>
    </Layout>
  );
};

export default TrashPage;
