exports.News = class {
  constructor(title, content, id) {
    if (title) this.title = title;
    if (content) this.content = content;
    if (id) this.id = id;
  }
};

exports.createNews = (formData = {}) => {
  return new this.News(formData.title, formData.content, formData.id);
};
