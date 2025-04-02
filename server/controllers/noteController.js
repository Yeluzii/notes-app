import pool from "../config/db.js";

// 创建笔记,数据库默认type为'create'
export const createNote = async (req, res) => {
  try {
    const { userId, title, content, categoryId, tags } = req.body;
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content, category_id, tags) VALUES (?, ?, ?, ?, ?)",
      [userId, title, content, categoryId, JSON.stringify(tags)]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      title,
      content,
      categoryId,
      tags,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取笔记列表
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND delete_flag = 0",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据分类获取笔记列表
export const getNotesByCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND category_id = ? AND delete_flag = 0",
      [userId, categoryId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取单个笔记
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE id = ?",
      [id]
    );
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新笔记
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId, tags,type } = req.body;
    const [result] = await pool.query(
      "UPDATE notes SET title = ?, content = ?, category_id = ?, tags = ?,type = ? WHERE id = ?",
      [title, content, categoryId, JSON.stringify(tags),type, id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ id, title, content, categoryId, tags ,type});
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 逻辑删除笔记
export const trashNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "UPDATE notes SET type = 'trash', delete_flag = 1 WHERE id =?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "笔记已丢弃！" });
    } else {
      res.status(404).json({ error: "笔记找不到！" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取回收站笔记（逻辑删除的笔记）
export const getTrashNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id =? AND delete_flag = 1",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 恢复笔记
export const restoreNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "UPDATE notes SET type = 'update', delete_flag = 0 WHERE id =?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "笔记已恢复！" });
    } else {
      res.status(404).json({ error: "笔记找不到！" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 彻底删除笔记
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM notes WHERE id = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Note deleted" });
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};