"use client";

import { Text } from "@/components/elements/Texts";
import { LinkExternal } from "@/components/elements/LinkExternal/LinkExternal";
import Icon from "@/components/elements/Icon";
import { Section } from "@/components/elements/Section";

export default function HeaderTop() {
  return (
    <div className="bg-black">
      <Section>
        <div className="flex justify-between">
          <div className="flex gap-8">
            {/* Endereço */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 14.6667C8 14.6667 13 10.6667 13 6.33333C13 3.572 10.7613 1.33333 8 1.33333C5.23867 1.33333 3 3.572 3 6.33333C3 10.6667 8 14.6667 8 14.6667Z"
                  stroke="white"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 8.33333C8.26264 8.33333 8.52272 8.2816 8.76537 8.18109C9.00802 8.08058 9.2285 7.93326 9.41421 7.74755C9.59993 7.56183 9.74725 7.34135 9.84776 7.0987C9.94827 6.85605 10 6.59598 10 6.33333C10 6.07069 9.94827 5.81062 9.84776 5.56797C9.74725 5.32531 9.59993 5.10484 9.41421 4.91912C9.2285 4.7334 9.00802 4.58608 8.76537 4.48557C8.52272 4.38506 8.26264 4.33333 8 4.33333C7.46957 4.33333 6.96086 4.54405 6.58579 4.91912C6.21071 5.29419 6 5.8029 6 6.33333C6 6.86377 6.21071 7.37247 6.58579 7.74755C6.96086 8.12262 7.46957 8.33333 8 8.33333Z"
                  stroke="white"
                  strokeLinejoin="round"
                />
              </svg>
              <Text className="text-white text-xs">
                Avenida dos Autonomistas, 1400 - Vila Yara
              </Text>
            </div>

            {/* Horário */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 2C4.6875 2 2 4.6875 2 8C2 11.3125 4.6875 14 8 14C11.3125 14 14 11.3125 14 8C14 4.6875 11.3125 2 8 2Z"
                  stroke="white"
                  strokeMiterlimit="10"
                />
                <path
                  d="M8 4V8.5H11"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Text className="text-white text-xs">
                Seg / Sáb 09:00 às 18:30.
              </Text>
            </div>
          </div>

          {/* Redes sociais */}
          <div className="flex gap-2">
            <LinkExternal
              className="h-10 w-10 flex items-center justify-center"
              href="/"
              aria-label="Linkedin"
            >
              <Icon name="FaLinkedinIn" color="#ffff" size={16} />
            </LinkExternal>
            <LinkExternal
              className="h-10 w-10 flex items-center justify-center"
              href="/"
              aria-label="Instagram"
            >
              <Icon name="FaInstagram" color="#ffff" size={16} />
            </LinkExternal>
            <LinkExternal
              className="h-10 w-10 flex items-center justify-center"
              href="/"
              aria-label="Facebook"
            >
              <Icon name="FaFacebookF" color="#ffff" size={16} />
            </LinkExternal>
          </div>
        </div>
      </Section>
    </div>
  );
}
