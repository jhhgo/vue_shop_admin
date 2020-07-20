<template>
  <div class="wrap">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert show-icon :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类</span>
          <el-cascader
            class="cascader"
            v-model="selectedKeys"
            :options="cates"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="selectedKeys.length===3?false:true"
            type="primary"
            @click="showAddParamsDialog"
            size="mini"
          >添加参数</el-button>
          <el-table :data="manyTableData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleClosed(scope.row, i)"
                  closable
                  class="tag"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="selectedKeys.length===3?false:true"
            type="primary"
            @click="showAddParamsDialog"
            size="mini"
          >添加属性</el-button>
          <el-table :data="onlyTableData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleClosed(scope.row, i)"
                  closable
                  class="tag"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  @click="deleteParams(scope.row.attr_id)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + diaLogTitleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="handleAddDialogClose"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item :label="diaLogTitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name" :placeholder="'请输入' + diaLogTitleText + '的名称'"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + diaLogTitleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="handleEditDialogClose"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="80px">
        <el-form-item :label="diaLogTitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name" :placeholder="'请输入' + diaLogTitleText + '的名称'"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParmas">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getCateList()
  },
  data () {
    return {
      cates: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 添加参数表单
      addForm: {
        attr_name: ''
      },
      // 修改参数表单
      editForm: {
        attr_id: -1,
        attr_name: ''
      },
      // 添加、修改表单的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            require: true,
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 选择的分类id数组
      selectedKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addParamsDialogVisible: false,
      editParamsDialogVisible: false
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cates = res.data
    },
    handleChange () {
      this.getParamData()
    },
    handleClick () {
      this.getParamData()
    },
    // 获取参数列表
    async getParamData () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 显示添加参数对话框
    showAddParamsDialog () {
      this.addParamsDialogVisible = true
    },
    // 监听添加参数对话框关闭
    handleAddDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改参数对话框关闭
    handleEditDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定，添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const postBody = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          postBody
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.getParamData()
        this.addParamsDialogVisible = false
      })
    },
    // 显示修改参数对话框
    async showEditDialog (id) {
      const {
        data: res
      } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm.attr_id = res.data.attr_id
      this.editForm.attr_name = res.data.attr_name
      this.editParamsDialogVisible = true
    },
    // 点击确定，修改参数
    editParmas () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新参数失败！')
        }
        this.$message.success('更新参数成功！')
        this.getParamData()
        this.editParamsDialogVisible = false
      })
    },
    // 删除参数
    deleteParams (id) {
      this.$confirm('确定删除此参数吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(
        async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
          }
          this.$message.success('删除参数成功！')
          this.getParamData()
        },
        () => {
          this.$message.info('取消删除')
        }
      )
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.setAttrVals(row)
    },
    showInput (row) {
      row.inputVisible = true
      // DOM还没更新
      // $nextTick
      // 在下次DOM更新之后才执行回调函数
      this.$nextTick(_ => {
        // DOM更新了，执行回调函数
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClosed (row, id) {
      row.attr_vals.splice(id, 1)
      this.setAttrVals(row)
    },
    async setAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    }
  },
  computed: {
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    diaLogTitleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.cascader {
  margin-left: 15px;
}

.tag {
  margin: 0 5px;
}

.input-new-tag {
  margin: 15px 5px 0 5px;
  width: 150px;
}

.button-new-tag {
  margin: 15px 5px 0 5px;
}
</style>
