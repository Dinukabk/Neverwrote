module.exports = function(sequelize, DataTypes) {
  const Notebook = sequelize.define('Notebook', {
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    }
  });
  return Notebook;
};
