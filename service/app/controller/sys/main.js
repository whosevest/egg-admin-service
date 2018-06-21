'use strict';
const Controller = require('./../../core/baseController');

class sysMainController extends Controller {

  async sidebar(ctx) {
    if (!ctx.isAuthenticated()) {
      this.failure({
        data: ctx.user,
        state: 401,
      });

      return false;
    }

    // 使用 mysql.escape 方法,做复杂的表关联查询
    const result = await ctx.app.mysql.get('back').query('select distinct bm.* from role_module rm left join module bm on rm.id=bm.id left join user_role ur on rm.role_id=ur.role_id WHERE ur.user_id=? AND bm.show=1', [ ctx.user.id ]);

    // 根据父级id遍历子集
    const subset = function(parentId) {
      const arr = [];

      // 查询该id下的所有子集
      result.forEach(function(obj) {
        if (obj.parent_id === parentId) {
          arr.push(Object.assign(obj, {
            children: subset(obj.id),
          }));
        }
      });

      // 如果没有子集 直接退出
      if (arr.length === 0) {
        return [];
      }

      // 对子集进行排序
      arr.sort(function(val1, val2) {
        if (val1.sort < val2.sort) {
          return -1;
        } else if (val1.sort > val2.sort) {
          return 1;
        }
        return 0;

      });

      return arr;
    };

    const convert = function(arr) {
      const arrMap = [];
      arr.forEach(obj => {
        arrMap.push({
          menuIcon: obj.iconfont,
          menuName: obj.name,
          menuUrl: obj.url,
          describe: obj.describe,
          childrens: obj.children && convert(obj.children),
        });
      });
      return arrMap;
    };

    this.success(convert(subset(0)));
  }
}
module.exports = sysMainController;