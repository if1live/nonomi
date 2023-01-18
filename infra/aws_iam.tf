resource "aws_iam_user" "main" {
  name = "nonomi"
  path = "/nonomi/"
}

resource "aws_iam_access_key" "main" {
  user    = aws_iam_user.main.name
}

resource "aws_iam_user_policy" "main_ro" {
  name = "nonomi-router"
  user = aws_iam_user.main.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "lambda:ListFunctionUrlConfigs*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}
