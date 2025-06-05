import * as React from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface ShipItWelcomeEmailTemplateProps {
  name: string;
}

export const ShipItWelcomeEmailTemplate: React.FC<Readonly<ShipItWelcomeEmailTemplateProps>> = ({ name }) => (
  <Html>
    <Tailwind>
      <Head />
      <Preview>Welcome to Ship-It! Your AI-augmented project management platform awaits.</Preview>
      <Body className="bg-gray-100 font-sans py-[40px]">
        <Container className="bg-white rounded-[8px] px-[32px] py-[40px] mx-auto max-w-[600px]">
          <Section className="text-center mb-[32px]">
            <Heading className="text-[32px] font-bold text-blue-900 m-0 mb-[16px]">
              Welcome to Ship-It! 🚀
            </Heading>
            <Text className="text-[18px] text-gray-600 m-0">
              Your AI-augmented project management platform is ready
            </Text>
          </Section>
          <Section className="mb-[32px]">
            <Text className="text-[16px] text-gray-900 mb-[16px] m-0">Hi {name},</Text>
            <Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
              Welcome to Ship-It, the real-time, AI-augmented task and project management platform designed to
              enhance developer productivity and streamline team collaboration. We're excited to help you and
              your team build better, faster.
            </Text>
          </Section>

          {/* Key Features */}
          <Section className="mb-[32px]">
            <Heading className="text-[20px] font-bold text-gray-900 m-0 mb-[16px]">
              What makes Ship-It special?
            </Heading>

            <Text className="text-[16px] text-gray-700 mb-[12px] m-0 leading-[24px]">
              <strong>🤖 AI-Powered Intelligence:</strong> Comment summarization, auto-generated user stories,
              and sentiment-based reminders
            </Text>

            <Text className="text-[16px] text-gray-700 mb-[12px] m-0 leading-[24px]">
              <strong>⚡ Real-Time Collaboration:</strong> Live updates via web sockets ensure seamless team
              coordination
            </Text>

            <Text className="text-[16px] text-gray-700 mb-[12px] m-0 leading-[24px]">
              <strong>📋 Customizable Boards:</strong> Organize tasks with statuses like Not Started, In
              Progress, Blocked, and Done
            </Text>

            <Text className="text-[16px] text-gray-700 mb-[12px] m-0 leading-[24px]">
              <strong>🔔 Smart Notifications:</strong> Stay informed with intelligent email alerts and
              notifications
            </Text>

            <Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
              <strong>🏗️ Developer-First Design:</strong> Built with React, Node.js, Prisma, and RabbitMQ for
              scalability
            </Text>
          </Section>

          {/* CTA Button */}
          <Section className="text-center mb-[32px]">
            <Button
              href="https://ship-it.com/dashboard"
              className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
            >
              Start Building with Ship-It
            </Button>
          </Section>

          {/* Value Proposition */}
          <Section className="mb-[32px] bg-blue-50 rounded-[8px] px-[24px] py-[20px]">
            <Text className="text-[16px] text-blue-900 mb-[12px] m-0 leading-[24px]">
              <strong>Focus on building, not micromanaging</strong>
            </Text>
            <Text className="text-[14px] text-blue-700 m-0 leading-[20px]">
              Ship-It empowers product managers to define user stories clearly and provides engineers with a
              structured workspace to plan and execute. Let our AI handle the routine tasks while you focus on
              what matters most - shipping great products.
            </Text>
          </Section>

          {/* Getting Started */}
          <Section className="mb-[32px]">
            <Heading className="text-[18px] font-bold text-gray-900 m-0 mb-[16px]">
              Ready to get started?
            </Heading>
            <Text className="text-[16px] text-gray-700 mb-[8px] m-0 leading-[24px]">
              • Create your first project board
            </Text>
            <Text className="text-[16px] text-gray-700 mb-[8px] m-0 leading-[24px]">
              • Invite your team members for real-time collaboration
            </Text>
            <Text className="text-[16px] text-gray-700 mb-[8px] m-0 leading-[24px]">
              • Let AI generate your first user stories
            </Text>
            <Text className="text-[16px] text-gray-700 mb-[16px] m-0 leading-[24px]">
              • Experience the power of intelligent project management
            </Text>
          </Section>

          {/* Support */}
          <Section className="mb-[32px]">
            <Text className="text-[14px] text-gray-600 m-0 leading-[20px]">
              Questions? Our team is here to help you succeed. Reach out at{' '}
              <a href="mailto:support@ship-it.com" className="text-blue-600 no-underline">
                support@ship-it.com
              </a>
            </Text>
          </Section>

          {/* Footer */}
          <Section className="border-t border-gray-200 pt-[24px]">
            <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
              © 2025 Ship-It. All rights reserved.
            </Text>
            <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
              Building the future of agile product development
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
