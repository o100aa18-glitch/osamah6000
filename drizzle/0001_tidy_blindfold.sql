CREATE TABLE `service_booking_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(40) NOT NULL,
	`request_key` varchar(64) NOT NULL,
	`service_summary` text NOT NULL,
	`area` varchar(255) NOT NULL,
	`appointment_text` varchar(255) NOT NULL,
	`customer_name` varchar(120) NOT NULL,
	`customer_phone` varchar(32) NOT NULL,
	`status` enum('pending_whatsapp','whatsapp_opened') NOT NULL DEFAULT 'pending_whatsapp',
	`whatsapp_opened_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_booking_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_booking_requests_reference_unique` UNIQUE(`reference`),
	CONSTRAINT `service_booking_requests_request_key_unique` UNIQUE(`request_key`)
);
