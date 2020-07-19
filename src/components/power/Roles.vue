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
       <!-- 展开列 -->
       <el-table-column type="expand">
         <template slot-scope="scope">
           <el-row :class="['bd-bottom', i1===0?'bd-top':'']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
             <!-- 一级权限 -->
             <el-col :span="5">
               <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
               <i class="el-icon-caret-right"></i>
             </el-col>
             <!-- 二级三级权限 -->
             <el-col :span="19">
               <el-row :class="[i2===0?'':'bd-top']" v-for="(item2, i2) in item1.children" :key="item2.id">
                 <el-col :span="6">
                   <el-tag closable @close="removeRightById(scope.row, item2.id)" type="success">{{item2.authName}}</el-tag>
                   <i class="el-icon-caret-right"></i>
                 </el-col>
                 <el-col :span="18">
                   <el-tag @close="removeRightById(scope.row, item3.id)" closable type="warning" v-for="(item3) in item2.children" :key="item3.id">
                     {{item3.authName}}
                   </el-tag>
                 </el-col>
               </el-row>
             </el-col>
           </el-row>
         </template>
       </el-table-column>
       <el-table-column type="index"></el-table-column>
       <el-table-column label="角色名称" prop="roleName"></el-table-column>
       <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
       <el-table-column label="操作" width="300px">
         <template slot-scope="scope">
           <el-button size="mini" @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit">编辑</el-button>
           <el-button size="mini" @click="removeRoleById(scope.row.id)" type="danger" icon="el-icon-delete">删除</el-button>
           <el-button size="mini" @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting">分配权限</el-button>
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
    <!-- 编辑角色对话框 -->
    <el-dialog @close="editDialogClosed" title="编辑角色" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="editForm" ref="editFormRef" :rules="addFormRules" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc" placeholder="请输入角色名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
        <el-tree ref="treeRef" :default-checked-keys="defKeys" :default-expand-all="true" node-key="id" show-checkbox :data="rights" :props="props"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
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
      // 角色列表
      roles: [],
      // 权限列表
      rights: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '哈哈',
        roleDesc: '哈哈'
      },
      defKeys: [],
      props: {
        label: 'authName',
        children: 'children'
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
      },
      roleId: ''
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roles = res.data
    },
    // 关闭添加对话框
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭编辑对话框
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 显示编辑框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editForm = res.data
    },
    // 添加角色
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
    },
    // 编辑角色信息
    editRole () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error('角色信息更新失败！')
        }
        this.getRoleList()
        this.editDialogVisible = false
        this.$message.success('角色信息更新成功！')
      })
    },
    // 删除指定id的角色
    removeRoleById (id) {
      this.$confirm('确定要删除此角色吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('角色删除失败！')
        }
        this.getRoleList()
        this.$message.success('角色删除成功！')
      }, () => {
        this.$message.info('取消删除')
      })
    },
    // 删除指定id的权限
    removeRightById (role, rightId) {
      this.$confirm('确定要删除此权限吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('权限删除失败！')
        }
        role.children = res.data
        this.$message.success('权限删除成功！')
      }, () => {
        this.$message.info('取消删除')
      })
    },
    // 显示分配权限对话框
    async showSetRightDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败！')
      }
      this.roleId = role.id
      this.rights = res.data
      this.defKeys = []
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取角色所有的三级权限id
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('权限更新失败！')
      }
      this.$message.success('权限更新成功！')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bd-top {
    border-top: 1px solid #eee;
  }

  .bd-bottom {
    border-bottom: 1px solid #eee;
  }
</style>
