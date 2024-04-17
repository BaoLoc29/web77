

## Mongodb (NoSQL)

- Quản lí theo dạng collections
- Trong collections gồm có nhiều document 
- Trong document là dữ liệu có dạng key - value


## MongoDB Schema 

- Dùng để quy định và định hình các collections trong mongodb => ví dụ collections user sẽ gồm có username (string), age(number),...


## Pagination (Phân Trang)

- Không phân trang ở phía frontend, vì sẽ rất nặng khi get tất cả sản phẩm lên 1 lúc
- Thay vào đó sẽ phân trang ở phía backend (Mỗi khi người dùng chuyển trang sẽ gọi về phía backend để get sản phẩm lên)
- Để phân trang chúng ta cần truyền về => thứ 1 là số lượng phần tử hiển thị (pageSize) trên 1 trang => thứ 2 là số trang hiện tại (pageIndex) của người dùng
- sau khi nhận được số trang (pageIndex) và số phần tử trên 1 trang (pageSize) mà người dùng truyền về, chúng ta dùng hàm find().skip(pageSize * pageIndex - pageSize).limit(pageSize).
- Tính total page bằng cách lấy tất cả số lượng phần tử thông qua hàm countDocuments() => sau đó chia cho pageSize và lấy giá trị trần bằng hàm Math.ceil(countDocument / pageSize)

## Joi

- documentation: https://joi.dev/api/?v=17.12.2
- How to Custom error message: https://stackoverflow.com/questions/48720942/node-js-joi-how-to-display-a-custom-error-messages
- Key of error message: https://joi.dev/api/?v=17.12.2#list-of-errors


## Authentication 

- Sử dụng jsonwebtoken
- Khi người dùng đăng nhập vào chúng ta sẽ tạo ra 1 token với thư viện jsonwebtoken và trả về cho phía người dùng -> người dùng phải lưu token này lại để sử dụng cho các chức năng cần phải đăng nhập
- Token khi gửi đến backend sẽ có dạng Bearer token (Ví dụ Bearer ạksdhjahsdkjaghsjkdhashdkja)
- Chúng ta sẽ viết 1 middleware đặt tên là authentication để validate người dùng đã đăng nhập hay chưa


## Bài tập 

- Tạo model => product gồm có product_name (string), product_price (Number) => Thêm router và hàm tạo mới product

-https://mongoosejs.com/docs/guide.html
-https://mongoosejs.com/docs/queries.html (Quries)

- Tạo hàm phân trang cho phần product

- Tạo schema joi để validate dữ liệu cho các hàm => 1. Edit user, 2. Change password, 3. Sign up

- Thêm authentication cho các hàm ví dụ (Tạo sản phẩm, sửa sản phẩm)

- Ở hàm delete user => check xem user đã tồn tại hay chưa trước khi delete => Nếu user không tồn tại thì trả về người dùng không tồn tại