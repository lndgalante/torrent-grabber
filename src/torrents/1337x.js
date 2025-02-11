const needle = require("needle");
const xray = require("../utils/xray");

module.exports = class _1337x {
  constructor() {
    this.name = "1337x";
    this.active = false;
    this.checked = false;
    this.requireLogin = false;

    this.BASE_LINK = "https://1337x.to";
  }

  async search(query) {
    const resp = await needle(
      "get",
      `${this.BASE_LINK}/sort-search/${encodeURI(query)}/seeders/desc/1/`
    );

    const items = await xray(resp.body, "tbody > tr", [
      {
        title: "a:nth-child(2)@text",
        size: ".size@text | match: '(.+)<' | fixSize",
        seeds: ".seeds@text | int",
        trackerId: "a:nth-child(2)@href"
      }
    ]);

    return items;
  }

  async getMagnet(torrentId) {
    const resp = await needle("get", `${this.BASE_LINK}${torrentId}`);

    return await xray(
      resp.body,
      "ul.download-links-dontblock > li:nth-child(1) > a@href"
    );
  }

  async activate() {
    const resp = await needle("get", `${this.BASE_LINK}`);

    if (resp.statusCode !== 200) {
      throw new Error();
    }
  }
};
