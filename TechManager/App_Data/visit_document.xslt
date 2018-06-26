<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" encoding="utf-8" indent="yes" />

  <xsl:template match="/">
    <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html></xsl:text>
    <html>
      <head>
        <meta content="text/html; charset=utf-8" http-equiv="content-type" />
        <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE10" />
        <title></title>        
      </head>
      <body style="padding: 5px 5px 20px 5px;">
        <table style="border: 1px solid #777; width: 100%; margin-top: 2px;">
          <thead>
            <tr style="background-color: #9BCDFF; font-size: 12px; color: #555;">
              <th style="padding: 2px 0 5px 0;">მოწყობილობაზე ჩატარებული მოქმედებები</th>
              <th style="padding: 2px 0 5px 0;">მოქმედების კომენტარი</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="*/items/item">
              <tr>
                <td style="background-color: #f7f7f7; font-size: 12px;">
                  <xsl:value-of select="Text" />
                </td>
                <td style="background-color: #f7f7f7; font-size: 12px;">
                  <xsl:value-of select="Comment" />
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>

        <br />
        <br />
        <br />
        <br />
        
        <h5 style="font-weight: normal;">კომპანია EGT -ს თანამშრომლის ხელმოწერა</h5>
        <img>
          <xsl:attribute name="src">
              <xsl:value-of select="*/CreatorUserSignature"/>
          </xsl:attribute>
      
          <xsl:attribute name="width">
              <xsl:value-of select="*/width"/>
          </xsl:attribute>
      
          <xsl:attribute name="height">
              <xsl:value-of select="*/height"/>
          </xsl:attribute>
        </img>
        
        <br />
        <br />
        <hr />
        <br />
        <br />
        
        <h5 style="font-weight: normal;">კონტრაგენტის ხელმოწერა</h5>
        <img>
          <xsl:attribute name="src">
              <xsl:value-of select="*/ContragentSignature"/>
          </xsl:attribute>
      
          <xsl:attribute name="width">
              <xsl:value-of select="*/width"/>
          </xsl:attribute>
      
          <xsl:attribute name="height">
              <xsl:value-of select="*/height"/>
          </xsl:attribute>
        </img>
        
        <hr />
      
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>