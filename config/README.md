Place configuration files in this directory.
/role:
  $ref: ./role.yaml
/role/{id}:
  $ref: ./role.yaml

==================
     /user:
    
  /user/{id}:

  /hello:
    # binds a127 app logic to a route
    x-swagger-router-controller: hello_world
    get:
      description: Returns 'Hello' to the caller
      # used as the method name of the controller
      operationId: hello
      parameters:
        - name: name
          in: query
          description: The name of the person to whom to say hello
          required: false
          type: string
      responses:
        "200":
          description: Success
          schema:
            # a pointer to a definition
            $ref: "#/definitions/HelloWorldResponse"
        # responses may fall through to errors
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
  /swagger:
    x-swagger-pipe: swagger_raw
   =================
  /role:
    x-swagger-router-controller: role
    get:
      operationId: getAll
      description: get the roles list
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/GetRolesListResponse"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
        
    post:
      operationId: save
      description: add a new role to the list
      # role info to be stored
      parameters:
        - name: name
          description: role properties
          in: body
          required: true
          schema:
            $ref: "#/definitions/Role"
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/GeneralResponse"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
 
  /role/{id}:
    x-swagger-router-controller: role
    get:
      # operationId: getOne
      description: get a role
      
      parameters:
        - name: id
          type: number
          in: path
          required: true
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/GetRoleResponse"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
     
    put:
      # operationId: update
      description: update a role
      
      parameters:
        - name: id
          description: role id
          type: number
          in: path
          required: true
        - name: name
          description: role name
          in: body
          required: true
          schema:
            $ref: "#/definitions/Role"
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/GeneralResponse"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
     
    delete:
      # operationId: delUser
      description: delete a role
      # define the parameters
      parameters:
        - name: id
          description: Role id
          type: number
          in: path
          required: true
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/GeneralResponse"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
            
