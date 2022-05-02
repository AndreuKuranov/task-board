export default class PostService {
  static async getAll() {
    let url = 'http://localhost:5000/all/taskBoard';
    let response = await fetch(url);
    let commits = await response.json();

    return commits;
  }

  static async putAll(obj, id) {
    let url = `http://localhost:5000/all/${id}`;
    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(obj)
    });
  }

  // static async getItem() {
  //   let url = `http://localhost:5000/all/taskBoard/`;
  //   let response = await fetch(url);
  //   let commits = await response.json();

  //   return commits;
  // }

  // static async postItem(obj) {
  //   let url = `http://localhost:5000/all`;
  //   await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json;charset=utf-8'
  //     },
  //     body: JSON.stringify(obj)
  //   });
  // }

  // static async putItem(id, obj) {
  //   let url = `http://localhost:5000/arr/${id}`;
  //   await fetch(url, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json;charset=utf-8'
  //     },
  //     body: JSON.stringify(obj)
  //   });
  // }
}