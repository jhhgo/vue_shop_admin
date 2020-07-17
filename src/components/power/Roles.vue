<template>
  <div class="wrap">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

   <!-- 卡片视图 -->
   <el-card>
     <el-row>
       <el-col>
         <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
       </el-col>
     </el-row>
     <!-- 角色列表 -->
     <el-table border stripe :data="roles">
       <el-table-column type="expand"></el-table-column>
       <el-table-column type="index"></el-table-column>
       <el-table-column label="角色名称" prop="roleName"></el-table-column>
       <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
       <el-table-column label="操作" width="300px">
         <template>
           <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
           <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
           <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
         </template>
       </el-table-column>
     </el-table>
   </el-card>

   <!-- 添加角色对话框 -->
   <el-dialog @close="addDialogClosed" title="添加角色" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getRoleList()
  },
  data () {
    return {
      roles: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { require: true, min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { require: true, min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roles = res.data
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          console.log(res)
          return this.$message.error('添加角色失败！')
        }
        this.getRoleList()
        this.$message.success('添加角色成功！')
        this.addDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
