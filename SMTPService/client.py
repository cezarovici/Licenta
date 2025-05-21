import py_eureka_client.eureka_client as eureka_client

your_rest_server_port = 8080

eureka_client.init(eureka_server="http://localhost:8761",
                   app_name="your_app_name",
                   instance_port=your_rest_server_port)