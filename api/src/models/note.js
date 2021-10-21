module.exports = function(sequelize, DataTypes) {
  const Note = sequelize.define('Note', {
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    content: {
      type: DataTypes.TEXT,
      validate: { notEmpty: true }
    },
    notebookId: {
      type: DataTypes.INTEGER
    }
  });
  return Note;
};
