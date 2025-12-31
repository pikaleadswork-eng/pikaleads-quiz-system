import { useState, useEffect } from "react";
import { parsePhoneNumber, AsYouType, CountryCode } from "libphonenumber-js";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

// Country codes with flags and dial codes
const COUNTRIES = [
  { code: "UA" as CountryCode, name: "Україна", flag: "🇺🇦", dialCode: "+380" },
  { code: "PL" as CountryCode, name: "Польща", flag: "🇵🇱", dialCode: "+48" },
  { code: "DE" as CountryCode, name: "Німеччина", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR" as CountryCode, name: "Франція", flag: "🇫🇷", dialCode: "+33" },
  { code: "US" as CountryCode, name: "США", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB" as CountryCode, name: "Велика Британія", flag: "🇬🇧", dialCode: "+44" },
  { code: "IT" as CountryCode, name: "Італія", flag: "🇮🇹", dialCode: "+39" },
  { code: "ES" as CountryCode, name: "Іспанія", flag: "🇪🇸", dialCode: "+34" },
  { code: "NL" as CountryCode, name: "Нідерланди", flag: "🇳🇱", dialCode: "+31" },
  { code: "BE" as CountryCode, name: "Бельгія", flag: "🇧🇪", dialCode: "+32" },
  { code: "AT" as CountryCode, name: "Австрія", flag: "🇦🇹", dialCode: "+43" },
  { code: "CH" as CountryCode, name: "Швейцарія", flag: "🇨🇭", dialCode: "+41" },
  { code: "SE" as CountryCode, name: "Швеція", flag: "🇸🇪", dialCode: "+46" },
  { code: "NO" as CountryCode, name: "Норвегія", flag: "🇳🇴", dialCode: "+47" },
  { code: "DK" as CountryCode, name: "Данія", flag: "🇩🇰", dialCode: "+45" },
  { code: "FI" as CountryCode, name: "Фінляндія", flag: "🇫🇮", dialCode: "+358" },
  { code: "PT" as CountryCode, name: "Португалія", flag: "🇵🇹", dialCode: "+351" },
  { code: "GR" as CountryCode, name: "Греція", flag: "🇬🇷", dialCode: "+30" },
  { code: "CZ" as CountryCode, name: "Чехія", flag: "🇨🇿", dialCode: "+420" },
  { code: "RO" as CountryCode, name: "Румунія", flag: "🇷🇴", dialCode: "+40" },
];

// Auto-detect country from browser/timezone
function detectCountry(): CountryCode {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language;
    
    // Map timezone to country
    if (timezone.includes("Kyiv") || locale.includes("uk")) return "UA";
    if (timezone.includes("Warsaw") || locale.includes("pl")) return "PL";
    if (timezone.includes("Berlin") || locale.includes("de")) return "DE";
    if (timezone.includes("Paris") || locale.includes("fr")) return "FR";
    if (timezone.includes("New_York") || timezone.includes("Los_Angeles") || locale.includes("en-US")) return "US";
    
    // Default to Ukraine
    return "UA";
  } catch {
    return "UA";
  }
}

export default function PhoneInput({
  value,
  onChange,
  className = "",
  placeholder = "Введіть номер телефону",
  required = false
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(detectCountry());
  const [formattedValue, setFormattedValue] = useState("");

  useEffect(() => {
    // Format existing value on mount
    if (value) {
      try {
        const phoneNumber = parsePhoneNumber(value);
        if (phoneNumber) {
          setSelectedCountry(phoneNumber.country || detectCountry());
          setFormattedValue(phoneNumber.formatInternational());
        } else {
          setFormattedValue(value);
        }
      } catch {
        setFormattedValue(value);
      }
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Format as you type
    const formatter = new AsYouType(selectedCountry);
    const formatted = formatter.input(input);
    
    setFormattedValue(formatted);
    
    // Return E.164 format for storage
    try {
      const phoneNumber = parsePhoneNumber(formatted, selectedCountry);
      if (phoneNumber && phoneNumber.isValid()) {
        onChange(phoneNumber.number); // E.164 format
      } else {
        onChange(formatted); // Keep formatted if not valid yet
      }
    } catch {
      onChange(formatted);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const newCountry = countryCode as CountryCode;
    setSelectedCountry(newCountry);
    
    // Clear and reformat with new country
    if (formattedValue) {
      try {
        const digits = formattedValue.replace(/\D/g, "");
        const formatter = new AsYouType(newCountry);
        const formatted = formatter.input(digits);
        setFormattedValue(formatted);
        
        const phoneNumber = parsePhoneNumber(formatted, newCountry);
        if (phoneNumber && phoneNumber.isValid()) {
          onChange(phoneNumber.number);
        } else {
          onChange(formatted);
        }
      } catch {
        // Keep existing value
      }
    }
  };

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={selectedCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-700">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{currentCountry.flag}</span>
              <span className="text-xs">{currentCountry.dialCode}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700 max-h-[300px]">
          {COUNTRIES.map((country) => (
            <SelectItem 
              key={country.code} 
              value={country.code}
              className="cursor-pointer hover:bg-zinc-800"
            >
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="text-sm">{country.name}</span>
                <span className="text-xs text-zinc-500">{country.dialCode}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        type="tel"
        value={formattedValue}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        required={required}
        className="flex-1 bg-zinc-900 border-zinc-700 text-white"
      />
    </div>
  );
}
