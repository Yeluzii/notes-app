import { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Modal, message, Spin } from 'antd';
import { getNotes, deleteNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const fetchNotesData = await getNotes(user.id);
      setNotes(fetchNotesData.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      message.error('获取笔记失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center p-6">
        <h1>笔记列表</h1>
        <Button type="primary" onClick={() => navigate('/create-note')}>
          创建笔记
        </Button>
      </div>
      <Spin spinning={loading}>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={notes}
          className="p-4"
          renderItem={(item) => (
            <Card className="bg-blue-100 m-2" hoverable>
              <Card.Meta
                title={item.title}
                description={
                  (item.content ? item.content.substring(0, 100) : '暂无内容') +
                  '...'
                }
              />
              <div className="my-4">
                {item.tags &&
                  item.tags.map((tag) => (
                    <Tag color="cyan" key={tag}>
                      {tag}
                    </Tag>
                  ))}
              </div>
              <a href={`/notes/${item.id}`}>点击查看详情</a>
              <Button
                type="primary"
                onClick={() => navigate(`/notes/edit/${item.id}`)}
              >
                编辑
              </Button>
              <Button
                type="primary"
                onClick={(e) => {
                  setModalVisible(true);
                  setSelectedNoteId(item.id);
                }}
              >
                删除
              </Button>
            </Card>
          )}
        />
      </Spin>
      <Modal
        onOk={async () => {
          setDeleteLoading(true);
          try {
            await deleteNote(selectedNoteId);
            message.success('笔记删除成功');
            fetchNotes();
          } catch (error) {
            console.error('Failed to delete note:', error);
            message.error('删除笔记失败');
          } finally {
            setModalVisible(false);
            setSelectedNoteId(null);
            setDeleteLoading(false);
          }
        }}
        confirmLoading={deleteLoading}
      >
        <p>确定要删除这条笔记吗？此操作不可恢复。</p>
      </Modal>
    </>
  );
};

export default Notes;
