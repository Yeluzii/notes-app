import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { updateNote, getNote } from '@/api/noteApi';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteForm';

const EditNote = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [noteData, setNoteData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesResponse = await getCategories();
        const noteResponse = await getNote(noteId);

        const categoriesData = categoriesResponse.data;
        const fetchedNoteData = noteResponse.data;

        setCategories(categoriesData);
        setNoteData(fetchedNoteData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [noteId]);

  const handleSubmit = async (values) => {
    try {
      const noteData = {
        ...values,
        userId: user.id,
      };
      await updateNote(noteId, noteData);
      message.success('笔记更新成功');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to update note:', error);
      message.error('更新笔记失败');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>编辑笔记</h1>
        <NoteForm
          initialValues={noteData}
          categories={categories}
          onSubmit={handleSubmit}
          submitButtonText="更新笔记"
          loading={loading}
        />
      </div>
    </>
  );
};

export default EditNote;
