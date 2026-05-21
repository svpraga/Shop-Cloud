resource "aws_sqs_queue" "orders" {
  name                        = "shopcloud-orders.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = 60
  tags = { Name = "shopcloud-order-queue" }
}
resource "aws_sns_topic" "order_events" {
  name = "shopcloud-order-events"
}
resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.order_events.arn
  protocol  = "email"
  endpoint  = "customer-notify@shopcloud.io"
}

output "queue_url"  { value = aws_sqs_queue.orders.id }
output "queue_arn"  { value = aws_sqs_queue.orders.arn }
output "topic_arn"  { value = aws_sns_topic.order_events.arn }