"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { IconCopy } from "@tabler/icons-react";
import { IconSquareRoundedNumber1Filled, IconSquareRoundedNumber2Filled, IconSquareRoundedNumber3Filled } from "@tabler/icons-react";
export default function Home() {
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [extractedContent, setExtractedContent] = useState('');

  const socialMediaLinks = [
    { name: 'Instagram', icon: '/instagram-icon.svg', url: 'https://instagram.com/worqhat' },
    { name: 'Discord', icon: '/discord-icon.svg', url: 'https://discord.gg/KHh9mguKBx' },
    { name: 'LinkedIn', icon: '/linkedin-icon.svg', url: 'https://linkedin.com/company/worqhat' },
    { name: 'Twitter', icon: '/twitter-icon.svg', url: 'https://twitter.com/worqhat' },
    { name: 'GitHub', icon: '/github-icon.svg', url: 'https://github.com/worqhat' },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('output_format', 'text');

      try {
        const response = await fetch('https://api.worqhat.com/api/ai/v2/pdf-extract', {
          method: 'POST',
          headers: {
            'x-api-key': 'U2FsdGVkX187FPQxzgbmIVjXh3O1+xyor30KWVrIBMuFEqGv8NfzXPjE53e3Ju+T',
            'x-org-key': 'U2FsdGVkX19lq3bhhF5TRouMiyL2HvEBD2V5j5nNl6dNL9JWPbsXW0rqlzssW8GieFki6oRVDKTb/z01Hc7m+Q==',
          },
          body: formData,
        });

        const data = await response.json();
        console.log(data);

        // Check if the content property exists in the API response
        if (data.content) {
          const extractedContent = data.content;
          setExtractedContent(extractedContent);
        } else {
          console.error('Error extracting content: Unexpected API response format');
        }
      } catch (error) {
        console.error('Error extracting content:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const generateCoverLetter = async () => {
    setIsLoading(true);
    try {
      const question = 'Generated a cover letter for the given extracted content';
      const fullQuestion = `${extractedContent}\n\n${question}`;
      const requestData = {
        question: fullQuestion,
        randomness: 0.4, // You can adjust the randomness factor as needed
      };

      const response = await fetch('https://api.worqhat.com/api/ai/content/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'U2FsdGVkX187FPQxzgbmIVjXh3O1+xyor30KWVrIBMuFEqGv8NfzXPjE53e3Ju+T',
          'x-org-key': 'U2FsdGVkX19lq3bhhF5TRouMiyL2HvEBD2V5j5nNl6dNL9JWPbsXW0rqlzssW8GieFki6oRVDKTb/z01Hc7m+Q==',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data); // Optional: Log the API response data

      // Check if the content property exists in the API response
      if (data.content) {
        const generatedCoverLetter = data.content;
        setCoverLetter(generatedCoverLetter);
      } else {
        console.error('Error generating cover letter: Unexpected API response format');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-full items-center justify-center p-5">
    <div className='logo' style={{ position: 'absolute', top: '0', left: '0', margin: '2%', fontSize: 'medium' }}>
      <Image src="/logo.png" alt="Logo" width={100} height={50} />
    </div>

    <div className='social-icons' style={{ position: 'absolute', top: '0', right: '0', margin: '10px', fontSize: 'medium', display: 'flex' }}>
      {socialMediaLinks.map((link, index) => (
        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" style={{ margin: '0 5px' }}>
          <Image src={link.icon} alt={link.name} width={20} height={20} />
        </a>
      ))}
    </div>
      <div className="container h-50 my-1 bg-white rounded-md text-white p-10">
        <h1 className="my-3 font-sans text-center text-4xl font-bold p-3 drop-shadow-lg bg-blue-600">
          Resume to cover letter
        </h1>

        <div className="text-center container rounded-md text-white my-4 p-5 flex flex-col items-center justify-center">
          <div className="upload flex flex-col items-center">
            <div>
              <label
                htmlFor="upload-button"
                className="btn bg-blue-600 text-white p-3 mx-auto cursor-pointer rounded-md"
              >
                Upload Resume
                <input
                  type="file"
                  id="upload-button"
                  className="hidden bg-bluem w-64"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </label>
              <div className="m-2 p-2 text-black">
                {uploadedFileName && <p>Uploaded File: {uploadedFileName}</p>}
              </div>
            </div>
          </div>
          <button
            type="button"
            id="generate-button"
            className="btn bg-green-600 text-white px-4 py-2 m-1 w-72 mx-auto cursor-pointer rounded-md"
            disabled={!uploadedFileName || isLoading || !extractedContent}
            onClick={generateCoverLetter}
          >
            {isLoading ? 'Generating...' : 'Generate cover letter'}
          </button>
        </div>
        <div className="cv bg-white h-64 rounded-md text-white p-5">
          <textarea
            className="border-2 text-black rounded-md w-full p-4 text-center drop-shadow-xl"
            id=""
            placeholder="Welcome to Resume to Cover Letter by Worqhat! Upload your resume and generate your cover letter."
            value={coverLetter}
            readOnly
          ></textarea>
        </div>
      </div>
      <div className='footer' style={{ textAlign: 'center', marginTop: '-45px', left: '0', bottom: '10px', width: '100%', color: 'black' }}>
          <p>&copy; 2023 Worqhat. All rights reserved.</p>
        </div>
    </main>
  );
}
