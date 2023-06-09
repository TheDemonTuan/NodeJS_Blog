const Promise = require("bluebird");
const Post = Promise.promisifyAll(require("../models/posts.js"));

// [GET] /datapacks/load/:lastId
exports.datapackLoad = async (req, res, next) => {
  if(!req.xhr)
    return res.status(201).json({ status: "error", message: "Can't load datapacks, please try again later.", lastId: 0, htmlCode: "" });
  try {
    const limit = 3
    var lastId = Number.isInteger(Number.parseInt(req.params.lastId)) ? Number.parseInt(req.params.lastId) : 0;

    if (lastId === 0)
      return res.status(201).json({ status: "error", message: "No more datapacks", lastId: 0, htmlCode: "" });

    if (lastId === -1)
      var posts = await Post.getWithLimitAsync(limit);
    else {
      var posts = await Post.paginateAsync(lastId, limit);
    }

    if (posts.length === 0)
      return res.status(201).json({ status: "error", message: "No more datapacks", lastId: 0, htmlCode: "" });

    let htmlCode = "";
    posts.forEach(post => {
      let tagList = post.tag_list;
      tagList = tagList.split(',');
      let tagHtml = "";
      tagList.forEach((tag) => {
        tagHtml += `
        <li class="list-inline-item"><a href="/tag/${tag.toLowerCase()}">${tag}</a></li>
        `;
      });
      htmlCode += `
      <article class="posts card mb-4">
        <div class="row card-body">
          <div class="col-md-4 mb-4 mb-md-0">
            <a href="${post.link}">
              <img class="card-img" src="${post.thumbnail}" alt="post-thumb" style="height:200px; object-fit: cover;">
            </a>
          </div>
          <div class="col-md-8">
            <h3 class="h4 mb-3"><a class="post-title" href="${post.link}">${post.title}</a></h3>
            <ul class="card-meta list-inline">
              <li class="list-inline-item"><a class="card-meta-author" href="author-single.html"><img src="/favicon.ico" alt="TheDemonTuan"><span>TheDemonTuan</span></a></li>
              <li class="list-inline-item"><i class="ti-timer"></i><span>${post.read_time} Min To Read</span></li>
              <li class="list-inline-item"><i class="ti-calendar"></i><span>Last Updated: ${new Date(post.updatedAt).toLocaleString('en-US')}</span></li>
              <li class="list-inline-item">
                <ul class="card-meta-tag list-inline">
                  ${tagHtml}
                </ul>
              </li>
            </ul>
            <p>${post.description}</p><a class="btn btn-outline-primary" href="${post.link}">Read More</a>
          </div>
        </div>
      </article>
      `;
    });
    res.status(201).json({ status: "success", message: "Load datapacks successfully", lastId: posts.at(-1).id, htmlCode: htmlCode });
  } catch (err) {
    res.status(201).json({ status: "error", message: "Can't load datapacks, please try again later.", lastId: 0, htmlCode: "" });
  }
};
