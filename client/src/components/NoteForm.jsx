import { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Tag, Select } from 'antd';
import Cherry from 'cherry-markdown';
import 'cherry-markdown/dist/cherry-markdown.css';

const NoteForm = ({
  type,
  initialValues,
  categories,
  onSubmit,
  submitButtonText,
  loading,
}) => {
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const cherryRef = useRef(null);

  // 如果有初始值，设置表单的初始值
  useEffect(() => {
    if (!cherryRef.current) {
      cherryRef.current = new Cherry({
        id: 'cherry-markdown',
        value: '',
        toolbars: {
          theme: 'light',
          toolbarRight: ['fullScreen'],
        },
      });
    }

    if (initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        categoryId: initialValues.category_id,
      });
      cherryRef.current.setValue(initialValues.content || '');
      setTags(initialValues.tags || []);
    }

    return () => {
      if (cherryRef.current) {
        cherryRef.current.destroy();
        cherryRef.current = null;
      }
    };
  }, [initialValues, form]);

  // 输入框内容变化时的处理函数
  const handleInputTagChange = (e) => {
    setInputTag(e.target.value);
  };

  // 添加标签的处理函数
  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  // 删除标签的处理函数
  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  // 提交表单时的处理函数
  const handleSubmit = async (values) => {
    const content = cherryRef.current.getValue();
    console.log('提交表单数据:', { ...values, content, tags });
    const noteData = {
      ...values,
      content,
      tags,
      type,
    };
    await onSubmit(noteData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6"
    >
      <Form.Item
        label={<span className="text-lg font-medium text-gray-700">标题</span>}
        name="title"
        rules={[{ required: true, message: '请输入笔记标题' }]}
      >
        <Input
          placeholder="请输入笔记标题"
          className="hover:border-blue-400 focus:border-blue-500 transition-colors"
        />
      </Form.Item>

      <Form.Item
        label={<span className="text-lg font-medium text-gray-700">类型</span>}
        name="categoryId"
        rules={[{ required: true, message: '请选择笔记类型' }]}
      >
        <Select placeholder="请选择笔记类型" className="hover:border-blue-400">
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">标签</label>
        <div className="flex gap-3">
          <Input
            value={inputTag}
            onChange={handleInputTagChange}
            placeholder="输入标签"
            onPressEnter={handleAddTag}
            className="flex-1 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
          <Button
            onClick={handleAddTag}
            className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            添加标签
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap pt-2">
          {tags.map((tag) => (
            <Tag
              key={tag}
              closable
              onClose={() => handleRemoveTag(tag)}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <Form.Item
        label={<span className="text-lg font-medium text-gray-700">内容</span>}
        rules={[{ required: true, message: '请输入笔记内容' }]}
      >
        <div className="border rounded-lg hover:border-blue-400 transition-colors overflow-hidden">
          <div ref={editorRef} id="cherry-markdown" />
        </div>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 h-10 text-lg transition-colors"
        >
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NoteForm;
