import React, { useState } from 'react';
import { Form, Input, Button, Tag, Select } from 'antd';

const NoteForm = ({
  initialValues,
  categories,
  onSubmit,
  submitButtonText,
  loading,
}) => {
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [form] = Form.useForm();

  // 如果有初始值，设置表单的初始值和标签
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        content: initialValues.content,
        categoryId: initialValues.category_id,
      });
      setTags(initialValues.tags || []);
    }
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
    const noteData = {
      ...values,
      tags,
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
      className="max-w-2xl mx-auto"
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入笔记标题' }]}
      >
        <Input placeholder="请输入笔记标题" />
      </Form.Item>

      <Form.Item
        label="内容"
        name="content"
        rules={[{ required: true, message: '请输入笔记内容' }]}
      >
        <Input.TextArea rows={6} placeholder="请输入笔记内容" />
      </Form.Item>

      <Form.Item
        label="类型"
        name="categoryId"
        rules={[{ required: true, message: '请选择笔记类型' }]}
      >
        <Select placeholder="请选择笔记类型">
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div className="mb-4">
        <label className="block mb-2">标签</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={inputTag}
            onChange={handleInputTagChange}
            placeholder="输入标签"
            onPressEnter={handleAddTag}
          />
          <Button onClick={handleAddTag}>添加标签</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NoteForm;
