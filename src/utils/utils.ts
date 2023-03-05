export default {
  //
  addJsonAndFolder(dbase: any, name: string) {
    dbase.getData((db: any) => {
      db.get("userList").push({ name, canDelete: true, icon: "icon-shuben" }).write();
      dbase.createFile(`doc/${name}`);
    });
  },
  deleteJsonAndFolder(dbase: any, name: string) {
    dbase.getData((db: any) => {
      db.get("userList").remove({ name }).write();
      dbase.removeFolder(`doc/${name}`);
    });
  }
};
