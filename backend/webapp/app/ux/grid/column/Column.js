/**
 * 带a标签的
 */
Ext.define('ux.grid.column.Column', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.uxColumn',
    listeners: {
        click: function (grid, td, rowIndex, columnIndex, e, record) {
            //isEdit是权限管理，需在后台配置权限
            if (e.target.tagName == 'A') {
                this.fireEvent('linkclick', grid, record);
                return false;
            }
            return false;
        }
    },
    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        if (view.grid.isEdit) {
            return Ext.util.Format.format('<a href="{0}" onclick="return false;">{0}</a>', Ext.String.htmlEncode(value));
        }
        return value;
    }
});