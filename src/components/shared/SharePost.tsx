import React, { useState } from "react";
import { Copy } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FiCopy } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "../ui";

type SharePostProps = {
  url: string;
  title: string;
};

const SharePost = ({ url, title }: SharePostProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const {toast} = useToast()

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%0A${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
      toast({
        title : 'Successfully copied'
      })
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <img
            src="/assets/icons/share.png"
            alt="share"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-dark-3">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={url}
                readOnly
                className="bg-dark-1"
              />
            </div>
            <Button
              type="button"
              size="sm"
              className='px-3 shad-button_primary'
              onClick={copyToClipboard}
            >         
            <FiCopy className="h-4 w-4 " />
            </Button>
          </div>
          <div className="flex space-x-2 mt-4">
            <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
              <Button  className="shad-button_primary">
                <FaFacebook className="h-5 w-5" />
              </Button>
            </a>
            <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
              <Button  className="shad-button_primary">
                <FaTwitter className="h-5 w-5" />
              </Button>
            </a>
            <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
              <Button className="shad-button_primary">
                <FaLinkedin className="h-5 w-5" />
              </Button>
            </a>
            <a href={shareUrls.telegram} target="_blank" rel="noopener noreferrer">
              <Button  className="shad-button_primary">
                <FaTelegram className="h-5 w-5" />
              </Button>
            </a>
            <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer">
              <Button  className="shad-button_primary">
                <FaWhatsapp className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharePost;
